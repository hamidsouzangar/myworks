function MOORA=MultiMooraFunction(x)
nx=size(x,1);
X=x;
for i=1:nx;
    x=X(i,:);
n=numel(x);
    
    z1=1-exp(-sum((x-1/sqrt(n)).^2));
    
    z2=1/(1-exp(-sum((x+1/sqrt(n)).^2)));
    z(i,:)=[z1 z2];
end
    %% reading Wn, DATA(E,F,M,..), P_N of each attribute,
Wn=[0.5 0.5]'; % Reading Wns 
%DATA=xlsread('Book1','Sheet1'); % whole Data 
n=size(Wn,1); % number of Attributes (E, F, M,..)
AA=z;% AA=[m,n];AA= decicion matrix, Attributes and Alternatives, m= number of Alternatives

%P_N=xlsread('Book1','Wn','C:c'); %PN_A=[1,n]; Ppsitive attributes=1, Negative attributes=-1
PN_A=[-1 1];
    pn_a=PN_A;
m=size(AA,1);%m= number of Alternatives
    wn=Wn.';
% xlswrite('Book1.xlsx',0,'Result','U2:U7');% rmove previous run data
% xlswrite('Book1.xlsx',Wn,'Result','U2');
for i=1:nx; % matrix of Wn(m*n) and p_N(m*n)
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
%for i=1:n;
%AASS=PN_A(i).*NDM(:,i);
%Rj(i)=abs(max(AASS));
%end
Rj=[0 1];
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

%%  
%MOORA=[Rank_zi; Rank_yi; Rank_ui]
   MOORA=[1/ui 1/Yi zi]';

end
