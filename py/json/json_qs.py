"""
Build JSON from CSV file of questions for Gamify Hackathon
"""
import json
# import csv




"""
QUESTION CONFIG
LOADING QUESTIONS DIRECTLY FROM TEXT HERE
"""
headers = ['Response_Code',	'Results']
results = ['category',	'type',	'difficulty', 'question',	'correct_answer',	'incorrect_answers']

response_code = 0
category = ["Health", "Tourism", "Geography","Cannabis", "Agriculture", "Nature"]
resultstype = ['boolean', 'multiple']
difficulty = 'easy'

questions = []
questions.append("Moderate to vigorous physical activity was measured in 12-17 year olds to be 49.7 minutes per day. Is it true that the self reported amount of time per day was greater than the measured amount?")
questions.append("What was the most visited country by Canadians in 2018, excluding the United States?")
questions.append("What age group spend the most time sedentary in 2017?")
questions.append("Please enter your height and weight. Do you think you are above or below the national average for BMI?")
questions.append("ON Region: What is the most populous CMA?")
questions.append("BC Region: What is the most populous CMA?")
questions.append("QC Region: What is the most populous CMA?")
questions.append("Which province had the highest percentage of cannabis users in the first quarter of 2019?")
questions.append("True or false: More than 60% of food bought by Canadians is produced domestically.")
questions.append("How much of Canada's Forest Lands are protected?")


correct_answer = []
correct_answer.append("FALSE")
correct_answer.append('Mexico')
correct_answer.append('Ages 60-79')
correct_answer.append('POST-DEFINED')
correct_answer.append('Toronto')
correct_answer.append('Vancouver')
correct_answer.append('Montreal')
correct_answer.append('Alberta')
correct_answer.append('TRUE (70%)')
correct_answer.append('7%')

incorrect_answers = []
incorrect_answers.append(['TRUE'])
incorrect_answers.append(["United Kingdom","Kazakhstan", "Thailand"])
incorrect_answers.append(["Ages 18-39", "Ages 6-11","Ages 40-59"])
incorrect_answers.append(["TRUE", "FALSE"])
incorrect_answers.append(["Ottawa-Gatineau","Windsor","Sudbury"])
incorrect_answers.append(["Victoria","Kelowna","Abbotsford-Mission"])
incorrect_answers.append(["Ottawa-Gatineau","Quebec","Sherbrooke"])
incorrect_answers.append(['Ontario','Quebec','British-Columbia'])
incorrect_answers.append(['FALSE'])
incorrect_answers.append(["0%", "50%", "99%"])




def build_dict(rcode, results, category, restype, diff, q, ans, incorrect):
	_d={}
	_d[headers[0]] = response_code
	
	# define the results dictionary below
	resultsdict = {}
	resultsdict[results[0]] = category
	resultsdict[results[1]] = restype
	resultsdict[results[2]] = diff
	resultsdict[results[3]] = q
	resultsdict[results[4]] = ans
	resultsdict[results[5]] = incorrect
	
	
	_d[headers[1]] = resultsdict
	
	return _d

	
# build lists of dictionaries
#_listdict = []
_listdict0 = []
_listdict1 = []
_listdict2 = []
_listdict3 = []
_listdict4 = []
_listdict5 = []
	
_listdict0.append(build_dict(response_code, results, category[0], resultstype[0], difficulty, questions[0], correct_answer[0], incorrect_answers[0]))
_listdict0.append(build_dict(response_code, results, category[0], resultstype[1], difficulty, questions[2], correct_answer[2], incorrect_answers[2]))
_listdict0.append(build_dict(response_code, results, category[0], resultstype[0], difficulty, questions[3], correct_answer[3], incorrect_answers[3]))

_listdict1.append(build_dict(response_code, results, category[1], resultstype[1], difficulty, questions[1], correct_answer[1], incorrect_answers[1]))

_listdict2.append(build_dict(response_code, results, category[2], resultstype[0], difficulty, questions[4], correct_answer[4], incorrect_answers[4]))
_listdict2.append(build_dict(response_code, results, category[2], resultstype[0], difficulty, questions[5], correct_answer[5], incorrect_answers[5]))
_listdict2.append(build_dict(response_code, results, category[2], resultstype[0], difficulty, questions[6], correct_answer[6], incorrect_answers[6]))
_listdict3.append(build_dict(response_code, results, category[3], resultstype[0], difficulty, questions[7], correct_answer[7], incorrect_answers[7]))
_listdict4.append(build_dict(response_code, results, category[4], resultstype[1], difficulty, questions[8], correct_answer[8], incorrect_answers[8]))
_listdict5.append(build_dict(response_code, results, category[5], resultstype[0], difficulty, questions[9], correct_answer[9], incorrect_answers[9]))

_listdict = {"0":_listdict0, "1":_listdict1, "2":_listdict2, "3":_listdict3, "4":_listdict4, "5":_listdict5}


#print(json.dumps(_listdict))


def load_file(path):
	"""
	deprecated reading CSV was going to be a bunch of work. would need to redevelop in future
	"""
	_list = []
	with open(path, mode='r') as infile:
		reader = csv.reader(infile)
		i = 0
		for rows in reader:
			i += 1
			if i == 1:
				listkeys = rows # create a list containing values
			else:
				_d={}
				# create a dictionary using row values and add to a list
				for j in range(len(listkeys)):
					print(rows[j])
					val = ast.literal_eval(rows[j])
					_d[listkeys[j]] = val
				_list.append(_d)
	return _list
	
	
def write_json(input, path):
	"""
	Take list of dicts input and write to JSON
	"""
	with open(path, 'w') as fout:
		json.dump(input, fout)

	return

write_json(_listdict, r"D:\Dougall\Hackathons\STATCAN\Gamify\questions.json")	
