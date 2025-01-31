import React from 'react';
import { Upload, Mail, Send, Loader2 } from 'lucide-react';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from './store';
import { setRecipients, setSubject, setContent, setPreview, sendEmails } from './store/emailSlice';
import { Recipient } from './types';

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const { recipients, subject, content, loading, preview } = useSelector(
    (state: RootState) => state.email
  );

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target?.result;
      if (typeof data !== 'string') return;

      if (file.name.endsWith('.csv')) {
        Papa.parse(data, {
          header: true,
          complete: (results) => {
            const parsedData = results.data.map((row: any) => ({
              ...row,
              company: row.company || 'your company'
            }));
            dispatch(setRecipients(parsedData as Recipient[]));
          }
        });
      } else {
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const parsedData = XLSX.utils.sheet_to_json(sheet).map((row: any) => ({
          ...row,
          company: row.company || 'your company'
        })) as Recipient[];
        dispatch(setRecipients(parsedData));
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleSendEmails = async () => {
    try {
      const result = await dispatch(sendEmails()).unwrap();
      console.log("result", result);
      
      alert(`Emails sent successfully!\nSuccess: ${result.success.length}\nFailed: ${result.failed.length}`);
    } catch (error) {
      alert('Error sending emails. Please try again.');
    }
  };

  const handlePreview = () => {
    if (recipients.length > 0) {
      dispatch(setPreview(recipients[0]));
    }
  };

  const formatContent = (content: string, recipient: Recipient) => {
    return content
      .replace(/{name}/g, recipient.name)
      .replace(/{company}/g, recipient.company)
      .split('\n')
      .map((line, index) => (
        <React.Fragment key={index}>
          {line}
          <br />
        </React.Fragment>
      ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Mail className="w-6 h-6" />
            Bulk Email Sender
          </h1>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Recipients (Excel/CSV)
            </label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-2 text-gray-500" />
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">Excel or CSV file</p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileUpload}
                />
              </label>
            </div>
            {recipients.length > 0 && (
              <p className="mt-2 text-sm text-gray-600">
                {recipients.length} recipients loaded
              </p>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject
              </label>
              <input
                type="text"
                className="w-full p-2 border rounded-md"
                value={subject}
                onChange={(e) => dispatch(setSubject(e.target.value))}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content
              </label>
              <div className="mb-2 text-sm text-gray-500">
                Use {'{name}'} for recipient name and {'{company}'} for company name
              </div>
              <textarea
                className="w-full p-2 border rounded-md h-40 font-sans"
                value={content}
                onChange={(e) => dispatch(setContent(e.target.value))}
                placeholder="Dear {name},&#10;&#10;Your message here...&#10;&#10;Best regards,&#10;[Your signature]"
              />
            </div>

            {preview && (
              <div className="mt-4 p-4 bg-gray-50 rounded-md">
                <h3 className="font-medium mb-2">Preview for {preview.name}</h3>
                <div className="text-sm">
                  <p><strong>Subject:</strong> {subject}</p>
                  <p><strong>Content:</strong></p>
                  <div className="mt-2 p-4 bg-white rounded whitespace-pre-wrap font-sans">
                    {formatContent(content, preview)}
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-4">
              <button
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                onClick={handleSendEmails}
                disabled={loading || !recipients.length || !subject || !content}
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                Send Emails
              </button>
              <button
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                onClick={handlePreview}
                disabled={!recipients.length}
              >
                Preview
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;