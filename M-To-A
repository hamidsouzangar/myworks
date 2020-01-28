clear all
clc
%%
h = msgbox('The operation has been started');
DoeFile = 'F:\sun\optimum_MODELS_0_15_30.xlsx';
num = xlsread(DoeFile);
k = num(:,8); 
k = k(isfinite(k));
k = size (k,1)
j=1+k
%filename = 'F:\sun\EXcel_0_15_30_Result.xlsx';;
MeshZise = 0.002
numCpus = 6

T1=[1 1.8 1.4];     %d[1]
T2=[0.3 0.8 0.5];    %d[4]
L3=[20 20 0.04 0.04 0.06 0.06];     %d[8]
L2=[0.02 0.04 0.06];     %d[9]

AA=[20 20 40 40 60 60 40;
    40 60 20 60 20 40 40];
for    bbb=: % 20-40-60 %X=1:3 % 0degree, 15 degree, 30 degree **n = 7 = 400 400
  n=3*bbb-2
    L3_2 = num(n,3);
    L2_3 = num(n,2);
    T1_0 = num(n,4);
    T2_1 = num(n,5);
    dg = 0;
    
    
    D=num(n,6);
    formatSpec = 'JOB_OPT_%d_%d_%dL2_%dL3_%dT_%dt';
Az = D;  
A0 = dg;    
A1 = round(L2_3);
A2 = round(L3_2);
A3 = T1_0*100;
A4 = round(T2_1*10);
JobName = sprintf(formatSpec,Az,A0,A1,A2,A3,A4);
   formatSpec = 'JOB_OPT_%d_%d_%dL2_%dL3_%dT_%dt.odb';
Az = D;  
A0 = dg;    
A1 = round(L2_3);
A2 = round(L3_2);
A3 = T1_0*100;
A4 = round(T2_1*10);
FileName = sprintf(formatSpec,Az,A0,A1,A2,A3,A4);
    formatSpec = 'Energy_OPT_%d_%d_%dL2_%dL3_%dT_%dt.txt';
Az = D;  
A0 = dg;    
A1 = round(L2_3);
A2 = round(L3_2);
A3 = T1_0*100;
A4 = round(T2_1*10);
EnergyName = sprintf(formatSpec,Az,A0,A1,A2,A3,A4);
    formatSpec = 'Force_OPT_%d_%d_%dL2_%dL3_%dT_%dt.txt';
Az = D;  
A0 = dg;    
A1 = round(L2_3);
A2 = round(L3_2);
A3 = T1_0*100;
A4 = round(T2_1*10);
ForceName = sprintf(formatSpec,Az,A0,A1,A2,A3,A4);




A10 = [T1_0;T2_1;L3_2;L2_3]/1000
A20 = {JobName;FileName;EnergyName;ForceName}
A30 = [MeshZise; numCpus];
inputs= A20;
fileID = fopen('Inputs.txt','wt');
formatSpec = '%d\n%d\n%d\n%d\n%s\n%s\n%s\n%s\n%d\n%d\n';
fprintf(fileID,formatSpec,A10,JobName,FileName,EnergyName,ForceName,A30);
fclose(fileID);
format shortg
Time = clock
%save('Inputs.txt','-struct',JobName);
%!"C:\SIMULIA\CAE\2016\win_b64\resources\install\cae\launcher.bat" cae noGUI="PY-0-opm-Steel.py"
!"C:\SIMULIA\CAE\2016\win_b64\resources\install\cae\launcher.bat" cae noGUI="PY-0-opm-Steel.py"
AAA = {JobName}
xlRange = 'I%d';
Az = n;
xlRange = sprintf(xlRange,Az);
xlswrite(DoeFile,AAA,1,xlRange)   

xlRange = 'H%d';
Az = n;
xlRange = sprintf(xlRange,Az);
xlswrite(DoeFile,1,1,xlRange) 
  n=3*bbb-1
    L3_2 = num(n,3);
    L2_3 = num(n,2);
    T1_0 = num(n,4);
    T2_1 = num(n,5);
    dg = 15;
    
    
    D=num(n,6);
    formatSpec = 'JOB_OPT_%d_%d_%dL2_%dL3_%dT_%dt';
Az = D;  
A0 = dg;    
A1 = round(L2_3);
A2 = round(L3_2);
A3 = T1_0*100;
A4 = round(T2_1*10);
JobName = sprintf(formatSpec,Az,A0,A1,A2,A3,A4);
   formatSpec = 'JOB_OPT_%d_%d_%dL2_%dL3_%dT_%dt.odb';
Az = D;  
A0 = dg;    
A1 = round(L2_3);
A2 = round(L3_2);
A3 = T1_0*100;
A4 = round(T2_1*10);
FileName = sprintf(formatSpec,Az,A0,A1,A2,A3,A4);
    formatSpec = 'Energy_OPT_%d_%d_%dL2_%dL3_%dT_%dt.txt';
Az = D;  
A0 = dg;    
A1 = round(L2_3);
A2 = round(L3_2);
A3 = T1_0*100;
A4 = round(T2_1*10);
EnergyName = sprintf(formatSpec,Az,A0,A1,A2,A3,A4);
    formatSpec = 'Force_OPT_%d_%d_%dL2_%dL3_%dT_%dt.txt';
Az = D;  
A0 = dg;    
A1 = round(L2_3);
A2 = round(L3_2);
A3 = T1_0*100;
A4 = round(T2_1*10);
ForceName = sprintf(formatSpec,Az,A0,A1,A2,A3,A4);




A10 = [T1_0;T2_1;L3_2;L2_3]/1000
A20 = {JobName;FileName;EnergyName;ForceName}
A30 = [MeshZise; numCpus];
inputs= A20;
fileID = fopen('Inputs.txt','wt');
formatSpec = '%d\n%d\n%d\n%d\n%s\n%s\n%s\n%s\n%d\n%d\n';
fprintf(fileID,formatSpec,A10,JobName,FileName,EnergyName,ForceName,A30);
fclose(fileID);
format shortg
Time = clock
%save('Inputs.txt','-struct',JobName);
%!"C:\SIMULIA\CAE\2016\win_b64\resources\install\cae\launcher.bat" cae noGUI="PY-15-opm-Steel.py"
!"C:\SIMULIA\CAE\2016\win_b64\resources\install\cae\launcher.bat" cae noGUI="PY-15-opm-Steel.py"
AAA = {JobName}
xlRange = 'I%d';
Az = n;
xlRange = sprintf(xlRange,Az);
xlswrite(DoeFile,AAA,1,xlRange)   

xlRange = 'H%d';
Az = n;
xlRange = sprintf(xlRange,Az);
xlswrite(DoeFile,1,1,xlRange) 

  n=3*bbb
    L3_2 = num(n,3);
    L2_3 = num(n,2);
    T1_0 = num(n,4);
    T2_1 = num(n,5);
    dg = 30;
    
    
    D=num(n,6);
    formatSpec = 'JOB_OPT_%d_%d_%dL2_%dL3_%dT_%dt';
Az = D;  
A0 = dg;    
A1 = round(L2_3);
A2 = round(L3_2);
A3 = T1_0*100;
A4 = round(T2_1*10);
JobName = sprintf(formatSpec,Az,A0,A1,A2,A3,A4);
   formatSpec = 'JOB_OPT_%d_%d_%dL2_%dL3_%dT_%dt.odb';
Az = D;  
A0 = dg;    
A1 = round(L2_3);
A2 = round(L3_2);
A3 = T1_0*100;
A4 = round(T2_1*10);
FileName = sprintf(formatSpec,Az,A0,A1,A2,A3,A4);
    formatSpec = 'Energy_OPT_%d_%d_%dL2_%dL3_%dT_%dt.txt';
Az = D;  
A0 = dg;    
A1 = round(L2_3);
A2 = round(L3_2);
A3 = T1_0*100;
A4 = round(T2_1*10);
EnergyName = sprintf(formatSpec,Az,A0,A1,A2,A3,A4);
    formatSpec = 'Force_OPT_%d_%d_%dL2_%dL3_%dT_%dt.txt';
Az = D;  
A0 = dg;    
A1 = round(L2_3);
A2 = round(L3_2);
A3 = T1_0*100;
A4 = round(T2_1*10);
ForceName = sprintf(formatSpec,Az,A0,A1,A2,A3,A4);




A10 = [T1_0;T2_1;L3_2;L2_3]/1000
A20 = {JobName;FileName;EnergyName;ForceName}
A30 = [MeshZise; numCpus];
inputs= A20;
fileID = fopen('Inputs.txt','wt');
formatSpec = '%d\n%d\n%d\n%d\n%s\n%s\n%s\n%s\n%d\n%d\n';
fprintf(fileID,formatSpec,A10,JobName,FileName,EnergyName,ForceName,A30);
fclose(fileID);
format shortg
Time = clock
%save('Inputs.txt','-struct',JobName);
%!"C:\SIMULIA\CAE\2016\win_b64\resources\install\cae\launcher.bat" cae noGUI="PY-30-opm-Steel.py"
!"C:\SIMULIA\CAE\2016\win_b64\resources\install\cae\launcher.bat" cae noGUI="PY-30-opm-Steel.py"
AAA = {JobName}
xlRange = 'I%d';
Az = n;
xlRange = sprintf(xlRange,Az);
xlswrite(DoeFile,AAA,1,xlRange)   

xlRange = 'H%d';
Az = n;
xlRange = sprintf(xlRange,Az);
xlswrite(DoeFile,1,1,xlRange) 

end


h = msgbox('Operation Completed');
