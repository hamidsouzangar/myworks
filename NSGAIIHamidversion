clc;
clear;
close all;

%% Problem Definition

CostFunction=@(x) MOP4(x);      % Cost Function
CostFunctionORG=@(x) MOP4ORG(x);
nVar=3;             % Number of Decision Variables

VarSize=[1 nVar];   % Size of Decision Variables Matrix

VarMin=-4;          % Lower Bound of Variables
VarMax= 4;          % Upper Bound of Variables

% Number of Objective Functions
nObj=numel(CostFunction(unifrnd(VarMin,VarMax,VarSize)));


%% NSGA-II Parameters

MaxIt=100;      % Maximum Number of Iterations

nPop=50;        % Population Size

pCrossover=0.7;                         % Crossover Percentage
nCrossover=2*round(pCrossover*nPop/2);  % Number of Parnets (Offsprings)

pMutation=0.4;                          % Mutation Percentage
nMutation=round(pMutation*nPop);        % Number of Mutants

mu=0.02;                    % Mutation Rate

sigma=0.1*(VarMax-VarMin);  % Mutation Step Size


%% Initialization

empty_individual.Position=[];
empty_individual.Cost=[];
empty_individual.CostORG=[];
empty_individual.Rank=[];
empty_individual.MltmrRank=[];
empty_individual.DominationSet=[];
empty_individual.DominatedCount=[];
empty_individual.CrowdingDistance=[];

pop=repmat(empty_individual,nPop,1);

for i=1:nPop
    
    pop(i).Position=unifrnd(VarMin,VarMax,VarSize);
    
    pop(i).Cost=CostFunction(pop(i).Position);
    pop(i).CostORG=CostFunctionORG(pop(i).Position);
end
%%F
% Non-Dominated Sorting
[pop F]=NonDominatedSorting(pop);
%%
% Calculate Crowding Distance
pop=CalcCrowdingDistance(pop,F);
%%
% Sort Population
[pop F]=SortPopulation(pop);

RRR=CostRankFunction(pop);
%%
for i=1:nPop
 pop(i).MltmrRank=RRR(i);
end
popMLTR=MLTMRSortPopulation(pop);
%% NSGA-II Main Loop

for it=1:MaxIt
    
    % Crossover
    popc=repmat(empty_individual,nCrossover/2,2);
    for k=1:nCrossover/2
        
        i1=randi([1 nPop]);
        p1=pop(i1);
        
        i2=randi([1 nPop]);
        p2=pop(i2);
        
        [popc(k,1).Position popc(k,2).Position]=Crossover(p1.Position,p2.Position);
        
        popc(k,1).Cost=CostFunction(popc(k,1).Position);
        popc(k,2).Cost=CostFunction(popc(k,2).Position);
        
        popc(k,1).CostORG=CostFunctionORG(popc(k,1).Position);
        popc(k,2).CostORG=CostFunctionORG(popc(k,2).Position);

    end
    popc=popc(:);
    
    %% Mutation
    popm=repmat(empty_individual,nMutation,1);
    for k=1:nMutation
        
        i=randi([1 nPop]);
        p=pop(i);
        popm(k).Position=MMMutate(p.Position,mu,sigma);
        popm(k).Cost=CostFunction(popm(k).Position);
        popm(k).CostORG=CostFunctionORG(popm(k).Position);

    end
    %%
    % Merge
    pop=[pop
         popc
         popm];
     %%
     
    % Non-Dominated Sorting
    [pop F]=NonDominatedSorting(pop);

    % Calculate Crowding Distance
    pop=CalcCrowdingDistance(pop,F);

    % Sort Population
    [pop F]=SortPopulation(pop);
    
    % Truncate
    pop=pop(1:nPop);
    
    % Non-Dominated Sorting
    [pop F]=NonDominatedSorting(pop);

    % Calculate Crowding Distance
    pop=CalcCrowdingDistance(pop,F);

    % Sort Population
    [pop F]=SortPopulation(pop);
   nPopTotal=size(pop,1);
RRR=CostRankFunction(pop);
for i=1:nPopTotal
 pop(i).MltmrRank=RRR(i);
end
    % Store F1
    F1=pop(F{1});
    popMLTR=MLTMRSortPopulation(pop);
    % Show Iteration Information
    disp(['Iteration ' num2str(it) ': Number of F1 Members = ' num2str(numel(F1))]);
    
    % Plot F1 Costs
    figure(1);
    PlotCosts(F1);
    
end

%% Results


