function popMLTR=MLTMRSortPopulation(pop)

    % Sort Based on Crowding Distance
    [~, CDSO]=sort([pop.CrowdingDistance],'descend');
    popMLTR=pop(CDSO);
    
    % Sort Based on Rank
    [~, RSO]=sort([popMLTR.MltmrRank]);
    popMLTR=popMLTR(RSO);
    
    % Update Fronts
    MLTRRanks=[popMLTR.MltmrRank];
    MaxRank=max(MLTRRanks);
    FM=cell(MaxRank,1);
    for r=1:MaxRank
        FM{r}=find(MLTRRanks==r);
    end

end
