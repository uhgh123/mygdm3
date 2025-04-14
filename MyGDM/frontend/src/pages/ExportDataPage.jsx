import React, { useEffect, useState } from 'react';
import { getLogs } from '../services/gdmApi';
import Layout from '../components/Layout';
import LogTableView from '../components/LogTableView';
import ExportInsights from '../components/ExportInsights';

const ExportDataPage = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      const data = await getLogs();
      setLogs(data);
    };
    fetchLogs();
  }, []);

  return (
    <Layout>
      <div className="p-section">
        <h1 className="heading">📄 Export GDM Data</h1>

        {/* Log Table (with filters + export buttons) */}
        <LogTableView logs={logs} />

        {/* Weekly & Monthly Summary Averages */}
        <ExportInsights logs={logs} />
      </div>
    </Layout>
  );
};

export default ExportDataPage;
