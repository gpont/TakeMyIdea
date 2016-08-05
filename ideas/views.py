from django.http import HttpResponse
from django.utils import dateformat
from django.db.models import Q
import json

from ideas.models import Idea, Category
from TakeMyIdea.settings import NUM_ITEMS_ON_PAGE

# POST: title, description, category
def new_idea(request):
	if request.user.is_authenticated():
		idea = Idea(
			creator=request.user,
			title=request.POST['title'],
			description=request.POST['description'],
			views=0,
			category=Category.objects.get(name=request.POST['category']))
		idea.save()
		return HttpResponse("true")
	else:
		return HttpResponse("false")

"""
# REWRITE!!!
def resize_image(data, output_size):
	image = Image.open(data)
	m_width = float(output_size[0])
	m_height = float(output_size[1])
	if image.mode not in ('L', 'RGB'):
		image = image.convert('RGB')
	return image.resize(new_size, Image.ANTIALIAS)

def upload_images(request, id_thread):
	alloved_files = ('.jpg', '.jpeg', '.png')
	num = 0
	for image_file in request.FILES:
		num += 1
		filename = request.FILES[image_file]['filename']
		name, ext = os.path.splitext(filename)
		if ext not in alloved_files:
			continue
		if filename == '':
			continue
		content = request.FILES[image_file]['content']
		# REWRITE!!!
		content = resize_image(content, (50, 50))
		if content.mode != "RGB":
			content = content.convert("RGB")
		content.save(settings.MEDIA_ROOT + 'threads_imgs/' + str(id_thread) + "_" + str(num) + '.jpeg', 'JPEG')
"""

def create_json_idea(i, user):
	return {
		'id':i.id,
		'title':i.title,
		'creator':i.creator.username,
		'description':i.description,
		'category':i.category.name,
		'date':str(i.publish_date.strftime('%d.%m.%y')),
		'likes':int(len(i.likes.all())),
		'views':int(i.views),
		'is_liked': user.is_authenticated() and user in i.likes.all()
	}

# POST: category, page
def get_ideas_by_category(request):
	def get_cat(cat):
		ideas = []
		subcategories = Category.objects.filter(par_category=cat)
		for i in subcategories:
			ideas.extend(get_cat(i))
		context = Idea.objects.filter(category=cat)
		for i in context:
			ideas.append(create_json_idea(i, request.user))
		return ideas
	ret = get_cat(Category.objects.get(pk=int(request.POST['category'])))
	ret = ret[int(request.POST['page'])*NUM_ITEMS_ON_PAGE:int(request.POST['page'])*10+10]
	return HttpResponse(json.dumps(ret))

# POST: id
def get_idea_by_id(request):
	i = Idea.objects.get(id=request.POST['id'])
	i.views += 1
	i.save()
	return HttpResponse(json.dumps(create_json_idea(i, request.user)))

# POST: search, page
def search(request):
	s = request.POST['search']
	ideas = Idea.objects.filter(Q(id__icontains=s)|
								Q(title__icontains=s)|
								Q(creator__username__icontains=s)|
								Q(description__icontains=s)|
								Q(category__name__icontains=s))
	ret = []
	for i in ideas:
		ret.append(create_json_idea(i, request.user))
	ret = ret[int(request.POST['page'])*NUM_ITEMS_ON_PAGE:int(request.POST['page'])*10+10]
	return HttpResponse(json.dumps(ret))

# POST: page
def get_the_most_popular_ideas(request):
	context = Idea.objects.all().order_by('likes')
	context = context[int(request.POST['page'])*NUM_ITEMS_ON_PAGE:int(request.POST['page'])*10+10]
	ret = []
	for i in context:
		ret.append(create_json_idea(i, request.user))
	return HttpResponse(json.dumps(ret))

# POST
def get_categories(request):
	def get_parsed_cats(cats_buf):
		cats = []
		for c in cats_buf:
			cats.append({
				"id": int(c.id),
				"name": c.name,
				"subs": get_parsed_cats(Category.objects.filter(par_category=c))
			})
		return cats
	return HttpResponse(json.dumps(get_parsed_cats(Category.objects.filter(par_category__isnull=True))))

# POST: thread_id
def like_thread(request):
	if request.user.is_authenticated():
		idea = Idea.objects.get(pk=request.POST["thread_id"])
		if request.user in idea.likes.all():
			idea.likes.remove(request.user)
		else:
			idea.likes.add(request.user)
		idea.save()
		return HttpResponse(str(len(idea.likes.all())))
	else:
		return HttpResponse("false")

# POST: page
def get_random_ideas(request):
	context = Idea.objects.all().order_by('?')
	context = context[int(request.POST['page'])*NUM_ITEMS_ON_PAGE:int(request.POST['page'])*10+10]
	ret = []
	for i in context:
		ret.append(create_json_idea(i, request.user))
	return HttpResponse(json.dumps(ret))
