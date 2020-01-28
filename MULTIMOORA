clc
clear all
%%
% The codes of MULTIMOORA 
% Hamidreza Souzangarzadeh
%Multi-objective optimization of cylindrical segmented tubes as energy
%absorbers under oblique crushes: D-optimal design and integration of
%MULTIMOORA with combinative weighting
try
	% See if there is an existing instance of Excel running.
	% If Excel is NOT running, this will throw an error and send us to the catch block below.
	Excel = actxGetRunningServer('Excel.Application');
	% If there was no error, then we were able to connect to it.
	Excel.Quit; % Shut down Excel.
catch
	% No instance of Excel is currently running.
end
Tube_N=xlsread('MULTIMOORA','Input','A2:A100');% NUmber of each tube%tube_t=xlsread('Book1','Input','D14:D100');% thickness of each  TMT tube 
tube_t=xlsread('MULTIMOORA','Input','D14:D40');% thickness of each  TMT tube 
Tube_t=tube_t;% add simples' thickess eqaul 0 to have 39*1 matrix.
Tube_L=xlsread('MULTIMOORA','Input','H:H');%length of each tube
%% reading Wn, DATA(E,F,M,..), P_N of each attribute,
Wn=xlsread('MULTIMOORA','Wn','B:B'); % Reading Wns 
DATA=xlsread('MULTIMOORA','Input','B2:K100'); % whole Data 
n=size(Wn,1); % number of Attributes (E, F, M,..)
AA=DATA(:,1:n);% AA=[m,n];AA= decicion matrix, Attributes and Alternatives, m= number of Alternatives

P_N=xlsread('MULTIMOORA','Wn','C:c'); %PN_A=[1,n]; Ppsitive attributes=1, Negative attributes=-1
PN_A=P_N(1:n,1)';
    pn_a=PN_A;
m=size(AA,1);%m= number of Alternatives
    wn=Wn.';
 xlswrite('MULTIMOORA.xlsx',Wn,'Output','j2');
for i=1:m; % matrix of Wn(m*n) and p_N(m*n)
wn(i,:)=Wn;
pn_a(i,:)=PN_A;
end
%% -Step one -NORMALIZED DEcision matrix
AS=sqrt(sum(AA.*AA));
as=AS;
for i=1:m;
as(i,:)=AS;
end
NDM=AA./as; %dimonsionless_ abs_ NORMALIZED DEcision matrix, 

%% -step two - ratio system
AAw=wn.*NDM; %weighted, matrix_abs w*times to NDM
AAwSS=pn_a.*AAw; %weighted matrix, postive and negative

Yi=sum(AAwSS.');
[yi,Ai]=sort(Yi,'descend');
[Ai_yi,Rank_yi]=sort(Ai);
%% step three reference point
for i=1:n;
AASS=PN_A(i).*NDM(:,i);
Rj(i)=abs(max(AASS));
end
rj=Rj;
for i=1:m;
rj(i,:)=Rj;
end
dij=rj-NDM;  %matrix d 
zi=max(abs(wn.*dij).');
[zii,B]=sort(zi);
[BB,Rank_zi]=sort(B);
%% step four  -------------

pi=NDM.^wn;
%find positive 
F_P=find(PN_A>0);
   l_P= length(F_P);
%find negative
F_N=find(PN_A<0);
  l_N=  length(F_N);
for i=1:m;
    for k=1:l_P;
       P(k)= pi(i,F_P(k));
    end
    
    for j=1:l_N;
        N(j)=pi(i,F_N(j));
    end
    ui(i)=(1*prod(P))/(1*prod(N));
end
[Uii,c]=sort(ui,'descend');
[ci,Rank_ui]=sort(c);
%% Step five -- final Ranking
Aj=Rank_ui;
Bj=Rank_zi;
Cj=Rank_yi;

Dj=zeros(1,m);
for i=1:m;
    Fj=zeros(1,m);
    for j=1:m;
               G=zeros(1,3);
                if Aj(1,i)<Aj(1,j);
            G(1,1)=1;
        else G(1,1)=-1;
        end
         if Bj(1,i)<Bj(1,j);
            G(1,2)=1;
        else G(1,2)=-1;
         end
         if Cj(1,i)<Cj(1,j);
            G(1,3)=1;
        else G(1,3)=-1;
         end
            Fj(j)=((sum(G)/abs(sum(G)))+1)/2;
            
    end
    Dj(i)=m-sum(Fj);
    end
   
Dj';
RRR=Dj';

%RESULT=[Tube_N,Tube_t,Tube_L,RRR]; % matrix of results 

%% thickness_ Mean

%%


xlswrite('MULTIMOORA.xlsx',RRR,'output','G2'); %RESULT

xlswrite('MULTIMOORA.xlsx',Rank_ui','Output','D2'); %Write Rank_ui
xlswrite('MULTIMOORA.xlsx',Rank_yi','Output','E2'); %Write Rank_yi
xlswrite('MULTIMOORA.xlsx',Rank_zi','Output','F2'); %Write Rank_zi
xlswrite('MULTIMOORA.xlsx',ui','Output','A2'); %Write ui
xlswrite('MULTIMOORA.xlsx',Yi','Output','B2'); %Write yi
xlswrite('MULTIMOORA.xlsx',zi','Output','C2'); %Write zi
sum_Wn=sum(Wn)
Number_of_Attributes=n

winopen('MULTIMOORA.xlsx');
hii = msgbox('Wn Wn Wn Operation Completed Wn Wn Wn','Wn','Help');
