function [pop F]=SSSortPopulation(pop)

    % Sort Based on Crowding Distance
    [~, CDSO]=sort([pop.CrowdingDistance],'descend');
    pop=pop(CDSO);
    
    % Sort Based on Rank
    [~, RSO]=sort([pop.MltmrRank]);
    pop=pop(RSO);
    
    % Update Fronts
    Ranks=[pop.MltmrRank];

    MaxRank=max(Ranks);
    F=cell(MaxRank,1);
   
    for r=1:MaxRank;
        F{r}=find(Ranks==r);
    end

end
