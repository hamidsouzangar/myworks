function z=MOP4ORG(x);

  
   n=numel(x);

    z1=1-exp(-sum((x-1/sqrt(n)).^2));
           
    z2=1-exp(-sum((x+1/sqrt(n)).^2));
    
    z4=[z1 z2];
	wn=[0.5 0.5];
	n=size(wn,1);
	pn_a=[1 1];
	m=size(z4,1);
	NDM=[1 1];
	%% -step two - ratio system
AAw=wn.*z4; %weighted, matrix_abs w*times to NDM
AAwSS=pn_a.*AAw; %weighted matrix, postive and negative
Yi=sum(AAwSS.');
%% step three reference point
Rj=[1 1];

rj(1,:)=Rj;

dij=rj-z4;  %matrix d 
zi=max(abs(wn.*dij).');
%% step four  -------------

pi=z4.^wn;
%find positive 
F_P=find(pn_a>0);
   l_P= length(F_P);
%find negative
F_N=find(pn_a<0);
  l_N=  length(F_N);
  for k=1:l_P;
       P(k)= pi(1,F_P(k));
    end
    
 %   for j=1:l_N;
 %       N(j)=pi(1,F_N(j));
 %   end
 N=[1];
    ui(1)=(1*prod(P))/(1*prod(N));
    N;
	(1*prod(P));
    (1*prod(N));
	%  z=[ 1/Yi zi 1/ui]';
     z=[Yi zi ui]';
end
