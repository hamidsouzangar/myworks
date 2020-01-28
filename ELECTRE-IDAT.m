clc
clear all
%%
%   The codes of ELECTRE_IDAT 
%   Hamidreza Souzangarzadeh
%   Manufacturing-process selection with interval Data

try
	% See if there is an existing instance of Excel running.
	% If Excel is NOT running, this will throw an error and send us to the catch block below.
	Excel = actxGetRunningServer('Excel.Application');
	% If there was no error, then we were able to connect to it.
	Excel.Quit; % Shut down Excel.
catch
	% No instance of Excel is currently running.
end
%%
%NAME={'NL_16'};% it for line 13
%xlswrite('Book1.xlsx',NAME,'Result','A1:C1');% it shows which method is using for Wn
M1=xlsread('VALIdation','First-Matrix','B5:O10');% M1= First matrix, Raw matrix, the initial data
%Tube_L=xlsread('Book1','Sheet4','H:H');%length of each tube
A=xlsread('VALIdation','First-Matrix','B14:H14');
B=xlsread('VALIdation','First-Matrix','B15:H15');
T=xlsread('VALIdation','First-Matrix','B16:H16');
C=xlsread('VALIdation','First-Matrix','B17:H17');
%%
% NORMALIZE:
Sz=size(M1);
for i=0:(Sz(2)/2)-1
XL(:,i+1)=M1(:,2*i+1);
XU(:,i+1)=M1(:,2*i+2);
end
for i=1:Sz(1)
    for j=1:Sz(2)/2
aL(i,j)=1-(abs(XL(i,j)-T(1,j))/max(abs(B(1,j)-T(1,j)),abs(A(1,j)-T(1,j))));
aU(i,j)=1-(abs(XU(i,j)-T(1,j))/max(abs(B(1,j)-T(1,j)),abs(A(1,j)-T(1,j))));
nL(i,j)=min(aL(i,j),aU(i,j));
nU(i,j)=max(aL(i,j),aU(i,j));
W(i,:)=C(1,:);
    end
end
nL=min(aL,aU);
nU=max(aL,aU);
WnL=W.*nL;
WnU=W.*nU;
%%
%Posibilities
Dis=[];
Dis2=[];

con=[];
con2=[];
Pro=[];
Pro2=[];
for i=1:Sz(1)-1
 for j=i+1:Sz(1)
   if i~=j
             Dis(size(Dis,1)+1,1:2)=[i,j];
             Dis2(size(Dis2,1)+1,1:2)=[i,j];
             con(size(con,1)+1,1:2)=[i,j];
             con2(size(con2,1)+1,1:2)=[i,j];
             Pro2(size(Pro,1)+1,1:2)=[i,j];

   for k=1:Sz(2)/2
              MA1 =max(0,WnU(i,k)-WnL(j,k));
            MA2= max(0,WnL(i,k)-WnU(j,k));
            DIME= (WnU(j,k)-WnL(j,k)+WnU(i,k)-WnL(i,k));
        pBA=(MA1-MA2)/DIME;
      Pro(size(Pro,1)+1,1:4) = [WnU(i,k),WnL(j,k),WnL(i,k),WnU(j,k)];
        Pro2(size(Pro2,1),3:6) = [WnU(i,k),WnL(j,k),WnL(i,k),WnU(j,k)];

        Pro(size(Pro,1),5)=MA1;
        Pro(size(Pro,1),6)=MA2;
       Pro(size(Pro,1),7)=DIME;
       Pro(size(Pro,1),8)=pBA;

     if WnL(i,k)== WnL(j,k) & WnU(i,k) == WnU(j,k) | WnL(i,k)>=WnU(j,k) |  pBA >= 0.5
     Dis(size(Dis,1),k+2)=k;
     Dis2(size(Dis2,1),k+2)=1;

     else  
     Dis(size(Dis,1),k+2)=0 ;
     Dis2(size(Dis,1),k+2)=0 ;
     con(size(Dis,1),k+2)=k     ;
     con2(size(con,1),k+2)=1;

     end
 %    else WnL(i,k)=>WnU(j,k)
%     con(n,length(con)+1)=k
%     else 
%pBA(i,j)=>(max(0,WnU(i,k)-WnL(j,k))-max(0,WnL(i,k)-WnU(j,k)))/(WnU(j,k)-WnL(j,k)+WnU(i,k)-WnL(i,k))
%pAB(k,i,j)=(max(0,WnU(j,k)-WnL(i,k))-max(0,WnL(j,k)-WnU(i,k)))/(WnU(j,k)-WnL(j,k)+WnU(i,k)-WnL(i,k))
   %  end
     end
        end
    end
end
ConcordanceSet=con2
DiscordanceSet=Dis2
%%
%Posibilities
Dis3=[];
con3=[];
Pro=[];
Pro2=[];
for i=1:Sz(1)
 for j=1:Sz(1)
   if i~=j
             Dis3(size(Dis3,1)+1,1:2)=[i,j];
             con3(size(con3,1)+1,1:2)=[i,j];
             Pro2(size(Pro,1)+1,1:2)=[i,j];

   for k=1:Sz(2)/2
              MA1 =max(0,WnU(i,k)-WnL(j,k));
            MA2= max(0,WnL(i,k)-WnU(j,k));
            DIME= (WnU(j,k)-WnL(j,k)+WnU(i,k)-WnL(i,k));
        pBA=(MA1-MA2)/DIME;
      Pro(size(Pro,1)+1,1:4) = [WnU(i,k),WnL(j,k),WnL(i,k),WnU(j,k)];
        Pro2(size(Pro2,1),3:6) = [WnU(i,k),WnL(j,k),WnL(i,k),WnU(j,k)];

        Pro(size(Pro,1),5)=MA1;
        Pro(size(Pro,1),6)=MA2;
       Pro(size(Pro,1),7)=DIME;
       Pro(size(Pro,1),8)=pBA;

     if WnL(i,k)== WnL(j,k) & WnU(i,k) == WnU(j,k) | WnL(i,k)>=WnU(j,k) |  pBA >= 0.5
     Dis3(size(Dis3,1),k+2)=1;

     else  
     Dis3(size(Dis3,1),k+2)=0 ;
     con3(size(con3,1),k+2)=1;

     end
 %    else WnL(i,k)=>WnU(j,k)
%     con(n,length(con)+1)=k
%     else 
%pBA(i,j)=>(max(0,WnU(i,k)-WnL(j,k))-max(0,WnL(i,k)-WnU(j,k)))/(WnU(j,k)-WnL(j,k)+WnU(i,k)-WnL(i,k))
%pAB(k,i,j)=(max(0,WnU(j,k)-WnL(i,k))-max(0,WnL(j,k)-WnU(i,k)))/(WnU(j,k)-WnL(j,k)+WnU(i,k)-WnL(i,k))
   %  end
     end
        end
    end
end
ConcordanceSet3=con3;
DiscordanceSet3=Dis3;

%%
for n=1:size(con,1)
    j=con2(n,1);
    i=con2(n,2);
    W=con2(n,3:size(con2,2)).*C;
Wcon(i,j)= sum(W);
Wcon(j,i)= 1-sum(W);
end
Wcon
%%
MDis=[]
for n=1:size(Dis3,1)
    j=Dis3(n,1);
    i=Dis3(n,2);
   %  vl=Dis3(n,3:size(Dis3,2)).*WnL(j,:)+Dis3(n,3:size(Dis3,2)).*WnU(j,:)
 %vu=Dis3(n,3:size(Dis3,2)).*WnL(i,:)+Dis3(n,3:size(Dis3,2)).*WnU(i,:)
 vl=Dis3(n,3:size(Dis3,2)).*WnL(j,:)-Dis3(n,3:size(Dis3,2)).*WnL(i,:);
   vu=Dis3(n,3:size(Dis3,2)).*WnU(j,:)-Dis3(n,3:size(Dis3,2)).*WnU(i,:);
   
   VS = [vl,vu];
  % VM = WnL(j,:)+WnL(j,:)-WnU(i,:)-WnU(i,:)
  VM = [WnL(j,:)-WnL(i,:),WnU(j,:)-WnU(i,:)];
    mVS= max(abs(VS));
    mVM= max(abs(VM));
MDis(i,j)= mVS/mVM;
end
MDis
%%
Thelastmatrix(:,1)=1:size(WnL,1);
for n=1:size(WnL,1);
    j=Dis3(n,1);
    i=Dis3(n,2);
    Thelastmatrix(n,2)= sum(Wcon(n,:)) - sum(Wcon(:,n)) ;
    Thelastmatrix(n,3)= sum(MDis(n,:)) - sum(MDis(:,n));
    Cu=max(Thelastmatrix(:,2));
    Cl=min(Thelastmatrix(:,2));
     Du=max(Thelastmatrix(:,3));
    Dl=min(Thelastmatrix(:,3));

end
for n=1:size(WnL,1);
    
    Thelastmatrix(n,4) = (Thelastmatrix(n,2)- Cl)/(Cu-Cl);
    Thelastmatrix(n,5) = (Thelastmatrix(n,3)- Dl)/(Du-Dl);
    if Cu==Cl;
        Thelastmatrix(n,6) = (Thelastmatrix(n,3)- Dl)/(Du-Dl);
    if Du==Dl;
       Thelastmatrix(n,6) = (Thelastmatrix(n,3)- Dl)/(Du-Dl);
    else
    Thelastmatrix(n,6) = 0.5*Thelastmatrix(n,4)+0.5*Thelastmatrix(n,5);
        end
    end
end
Thelastmatrix
%Probability=Pro
