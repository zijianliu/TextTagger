import { ClassificationResult as ClassificationResultType } from '@/types';

interface ClassificationResultProps {
  result: ClassificationResultType;
}

export const ClassificationResult = ({ result }: ClassificationResultProps) => {
  return (
    <div className="border rounded-lg p-4 mb-4 bg-white">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold">{result.category}</h3>
        <span className="text-sm text-gray-500">
          {new Date(result.timestamp).toLocaleString()}
        </span>
      </div>
      <div className="mb-2">
        <p className="text-gray-700">{result.text}</p>
      </div>
      <div className="flex items-center">
        <span className="text-sm font-medium">置信度:</span>
        <div className="ml-2 w-32 bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-blue-600 h-2.5 rounded-full" 
            style={{ width: `${result.confidence * 100}%` }}
          ></div>
        </div>
        <span className="ml-2 text-sm font-medium">
          {Math.round(result.confidence * 100)}%
        </span>
      </div>
    </div>
  );
};