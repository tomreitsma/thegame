import os, pprint, sys

def listDir(path, prependPath=None):
	output = []
	
	files = os.listdir(path)
	
	for file in files:
		if file in ['.svn', '.DS_Store']:
			continue
	
		if(os.path.isdir(os.path.join(path, file))):
			output.extend(listDir(os.path.join(path, file), path))
		else:
			if(prependPath):
				output.append(os.path.join(prependPath, file))
			else:
				output.append(file)
	
	return output

path = os.path.join('/'.join(sys.argv[0].split('/')[:-2]), 'app', 'images')
output = listDir(path)
pprint.pprint(output)
