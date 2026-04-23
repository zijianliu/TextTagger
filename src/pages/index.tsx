import { useState, useEffect } from 'react';
import { ClassificationResult } from '@/components/ClassificationResult';
import { classifyText, batchClassify, getHistory, uploadFile } from '@/services/api';
import { ClassificationResult as ClassificationResultType, Category } from '@/types';

export default function Home() {
  const [text, setText] = useState('');
  const [results, setResults] = useState<ClassificationResultType[]>([]);
  const [history, setHistory] = useState<ClassificationResultType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<Category | 'all'>('all');

  useEffect(() => {
    loadHistory();
  }, [filter]);

  const loadHistory = async () => {
    try {
      const data = await getHistory(filter !== 'all' ? { category: filter } : undefined);
      setHistory(data);
    } catch (err) {
      setError('加载历史记录失败');
    }
  };

  const handleClassify = async () => {
    if (!text.trim()) {
      setError('请输入文本');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await classifyText(text);
      setResults([result, ...results]);
      setText('');
      loadHistory();
    } catch (err) {
      setError('分类失败');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError('');

    try {
      const response = await uploadFile(file);
      setResults([...response.results, ...results]);
      loadHistory();
    } catch (err) {
      setError('文件上传失败');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter(e.target.value as Category | 'all');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-center mb-8">文本分类工具</h1>

        {/* 文本输入区域 */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-xl font-semibold mb-4">输入文本</h2>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="请输入要分类的文本..."
            className="w-full border rounded-lg p-4 h-32 mb-4"
          />
          <button
            onClick={handleClassify}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? '分类中...' : '开始分类'}
          </button>
        </div>

        {/* 文件上传区域 */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-xl font-semibold mb-4">上传文件</h2>
          <input
            type="file"
            accept=".txt,.csv"
            onChange={handleFileUpload}
            className="mb-4"
          />
          <p className="text-sm text-gray-500">支持上传 .txt 或 .csv 文件进行批量分类</p>
        </div>

        {/* 错误提示 */}
        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-8">
            {error}
          </div>
        )}

        {/* 分类结果 */}
        {results.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow mb-8">
            <h2 className="text-xl font-semibold mb-4">分类结果</h2>
            {results.map((result, index) => (
              <ClassificationResult key={index} result={result} />
            ))}
          </div>
        )}

        {/* 历史记录 */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">历史记录</h2>
            <select
              value={filter}
              onChange={handleFilterChange}
              className="border rounded-lg px-3 py-1"
            >
              <option value="all">全部</option>
              <option value="产品反馈">产品反馈</option>
              <option value="问题投诉">问题投诉</option>
              <option value="功能建议">功能建议</option>
              <option value="其他">其他</option>
            </select>
          </div>
          {history.length > 0 ? (
            history.map((result, index) => (
              <ClassificationResult key={index} result={result} />
            ))
          ) : (
            <p className="text-gray-500">暂无历史记录</p>
          )}
        </div>
      </div>
    </div>
  );
}