import React from 'react';
import Layout from '../components/Layout';
import ThemeSwitcher from '../components/ThemeSwitcher';

const SettingsPage = () => {
  return (
    <Layout>
      <div className="p-section space-y-6">
        <h1 className="heading">⚙️ App Settings</h1>

        {/* Theme Presets */}
        <section>
          <h2 className="text-xl font-semibold mb-2">🎨 Choose Theme</h2>
          <ThemeSwitcher />
        </section>

        {/* Future sections */}
        <section>
          <h2 className="text-xl font-semibold mb-2">🛠 Custom Theme (Coming Soon)</h2>
          <p className="text-gray-600 text-sm">Build your own theme with color and font options.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">🧠 Accessibility (Coming Soon)</h2>
          <ul className="list-disc pl-6 text-sm text-gray-700">
            <li>Font size scaling</li>
            <li>Dyslexia-friendly fonts</li>
            <li>Line height spacing</li>
            <li>High contrast toggle</li>
          </ul>
        </section>
      </div>
    </Layout>
  );
};

export default SettingsPage;
