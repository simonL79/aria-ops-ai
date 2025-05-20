
import React from 'react';
import { Separator } from "@/components/ui/separator";
import { ContentAlert } from "@/types/dashboard";
import ResultItem from "./ResultItem";

interface ResultListProps {
  results: ContentAlert[];
}

const ResultList: React.FC<ResultListProps> = ({ results }) => {
  return (
    <div className="divide-y">
      {results.map((result, index) => (
        <React.Fragment key={result.id}>
          <ResultItem result={result} />
          {index < results.length - 1 && <Separator />}
        </React.Fragment>
      ))}
    </div>
  );
};

export default ResultList;
