# -*- coding: mbcs -*-
#
# Abaqus/CAE Release 2016 replay file
# Internal Version: 2015_09_24-13.31.09 126547
# Run by Hamid on Tue Nov 14 05:15:55 2017
#

# from driverUtils import executeOnCaeGraphicsStartup
# executeOnCaeGraphicsStartup()
#: Executing "onCaeGraphicsStartup()" in the site directory ...
import time
time.sleep(5)

import csv
InputFile=open('Inputs.txt','rt')
h=[]
p = csv.reader(InputFile)
for row in p:
    h+=[row]
InputFile.close()
Inputs = []
for k in h:
    try:
        Inputs.append([float(v) for v in k])
    except ValueError:
        Inputs.append([v for v in k])
#print Inputs
from abaqus import *
from abaqusConstants import *
from caeModules import *
from driverUtils import executeOnCaeStartup
executeOnCaeStartup()
openMdb(pathName='F:/sun/ALL_0-15-30-3segmented tubes.cae')
#: The model database "'F:/abass_milani/30_degeree/TMT_STEEL_30_d.cae'" has been opened.
p = mdb.models['three_TMT_30'].parts['Atube']
a = mdb.models['three_TMT_30'].rootAssembly
a.regenerate()
#: Warning: Instance 'model_1_simple_1mm-1' has been modified to refer to renamed part 'Atube'.
a = mdb.models['three_TMT_30'].rootAssembly
Mdb()
#: A new model database has been created.
#: The model "Model-1" has been created.
openMdb(pathName='F:/sun/ALL_0-15-30-3segmented tubes.cae')
#: The model database "F:\test_TMT\three_segments_TMT_STEEL_30_d_6-16.cae" has been opened.
p = mdb.models['three_TMT_30'].parts['Atube']
a = mdb.models['three_TMT_30'].rootAssembly
a.regenerate()
#: Warning: Instance 'model_1_simple_1mm-1' has been modified to refer to renamed part 'Atube'.
a = mdb.models['three_TMT_30'].rootAssembly

p1 = mdb.models['three_TMT_30'].parts['Atube']

p = mdb.models['three_TMT_30'].parts['Atube']
s = p.features['Solid revolve-1'].sketch
mdb.models['three_TMT_30'].ConstrainedSketch(name='__edit__', objectToCopy=s)
s1 = mdb.models['three_TMT_30'].sketches['__edit__']
g, v, d, c = s1.geometry, s1.vertices, s1.dimensions, s1.constraints
s1.setPrimaryObject(option=SUPERIMPOSE)
p.projectReferencesOntoSketch(sketch=s1, 
    upToFeature=p.features['Solid revolve-1'], filter=COPLANAR_EDGES)
d[1].setValues(value=Inputs[0][0], )
d[4].setValues(value=Inputs[1][0], )
d[8].setValues(value=Inputs[2][0], )
d[9].setValues(value=Inputs[3][0], )
s1.unsetPrimaryObject()
p = mdb.models['three_TMT_30'].parts['Atube']
p.features['Solid revolve-1'].setValues(sketch=s1)
del mdb.models['three_TMT_30'].sketches['__edit__']
p = mdb.models['three_TMT_30'].parts['Atube']
p.regenerate()

p = mdb.models['three_TMT_30'].parts['Atube']
p.deleteMesh()
p = mdb.models['three_TMT_30'].parts['Atube']
p.deleteSeeds()
p = mdb.models['three_TMT_30'].parts['Atube']
p.seedPart(size=Inputs[8][0], deviationFactor=0.1, minSizeFactor=0.1)
p = mdb.models['three_TMT_30'].parts['Atube']
p.generateMesh()
mdb.save()
mdb.Job(name=Inputs[4][0], model='three_TMT_30', description='', type=ANALYSIS, 
    atTime=None, waitMinutes=0, waitHours=0, queue=None, memory=90, 
    memoryUnits=PERCENTAGE, explicitPrecision=SINGLE, 
    nodalOutputPrecision=SINGLE, echoPrint=OFF, modelPrint=OFF, 
    contactPrint=OFF, historyPrint=OFF, userSubroutine='', scratch='', 
    resultsFormat=ODB, parallelizationMethodExplicit=DOMAIN, numDomains=5, 
    activateLoadBalancing=False, multiprocessingMode=DEFAULT, numCpus=5)
mdb.jobs[Inputs[4][0]].submit(consistencyChecking=OFF)
mdb.jobs[Inputs[4][0]].waitForCompletion()
o1 = session.openOdb(name=Inputs[5][0]) #Opend ODB
o2 = o1.steps["Step-1"].historyRegions['Node PLATE-1.318'].historyOutputs['RF2']
o3=o2.data
Force=o3
mdb.save()
o2 = o1.steps["Step-1"].historyRegions['Assembly ASSEMBLY'].historyOutputs['ALLWK']
o3=o2.data
ExternalWork=o3

writeFile=open(Inputs[7][0],'w')
w=csv.writer(writeFile)
w.writerows([[Force]])
writeFile.close()

writeFile=open(Inputs[6][0],'w')
w=csv.writer(writeFile)
w.writerows([[ExternalWork]])
writeFile.close()
mdb.save()
#: The model database has been saved to "F:\abass_milani\30_degeree\TMT_STEEL_30_d.cae".
session.viewports['Viewport: 1'].setValues(
    displayedObject=session.odbs[Inputs[5][0]])
o3 = session.openOdb(name=Inputs[5][0])
session.viewports['Viewport: 1'].setValues(displayedObject=o3)
session.viewports['Viewport: 1'].odbDisplay.display.setValues(plotState=(
    CONTOURS_ON_DEF, ))
session.viewports['Viewport: 1'].view.setValues(session.views['Bottom'])
session.viewports['Viewport: 1'].view.setValues(session.views['Left'])
leaf = dgo.LeafFromPartInstance(partInstanceName=('PLATE-2', ))
session.viewports['Viewport: 1'].odbDisplay.displayGroup.remove(leaf=leaf)
leaf = dgo.LeafFromPartInstance(partInstanceName=('PLATE-1', ))
session.viewports['Viewport: 1'].odbDisplay.displayGroup.remove(leaf=leaf)
session.viewports['Viewport: 1'].view.setValues(nearPlane=0.380728, 
    farPlane=0.575501, cameraPosition=(-0.468299, 0.124959, 0.0185369), 
    cameraUpVector=(0.193852, 0.980462, 0.0334069), cameraTarget=(
    -1.42814e-005, 0.0330458, -0.00124236))
session.viewports['Viewport: 1'].view.setValues(cameraPosition=(-0.467552, 
    0.134553, -0.00836413), cameraTarget=(0.000732598, 0.04264, -0.0281434))
session.printToPrinter(printCommand='PRINTER[9]:Snagit 12', numCopies=1, 
    canvasObjects=(session.viewports['Viewport: 1'], ))
#o2 = o1.steps["Step-1"].frames[-1]  #Select the steps and frames
#o3 = o2.fieldOutputs['U'].values[int(Inputs[0][0])] #Select the output that we want and the number of element/Node
#o4 = o3.data[1] # select the data we want
#time.sleep(5)
#writeFile=open("Deflection2.txt",'w')
#w=csv.writer(writeFile)
#w.writerows([[o4]])
#writeFile.close()
time.sleep(5)
import sys
sys.exit()
