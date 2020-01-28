function RRR=CostRankFunction(pop)
%as=reshape([pop(1:10, :).CostORG],10,4)
as=[pop.CostORG];
Aj=as(1,:);
Bj=as(2,:);
Cj=as(3,:);
m=size(Aj,2);
as;
Dj=zeros(1,m);
for i=1:m;
    Fj=zeros(1,m);
    for j=1:m;
               G=zeros(1,3);
                if Aj(1,i)<=Aj(1,j);
            G(1,1)=1;
        else G(1,1)=-1;
        end
         if Bj(1,i)<=Bj(1,j);
            G(1,2)=1;
        else G(1,2)=-1;
         end
         if Cj(1,i)<=Cj(1,j);
            G(1,3)=1;
        else G(1,3)=-1;
         end
            Fj(j)=((sum(G)/abs(sum(G)))+1)/2;
            
    end
    RRR(i)=m-sum(Fj);
  
    end
%    FM=axRankMLTMR
end
