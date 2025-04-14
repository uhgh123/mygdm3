import React, { useMemo } from 'react';

const HIGH_THRESHOLD = 140;
const LOW_THRESHOLD = 70;

const SmartSuggestions = ({ logs }) => {
  const suggestions = useMemo(() => {
    const insights = [];

    if (!logs || logs.length === 0) {
      insights.push("You haven't logged any entries yet.");
      return insights;
    }

    const lastLog = logs.reduce((latest, current) =>
      new Date(current.timestamp) > new Date(latest.timestamp) ? current : latest
    );

    const daysSinceLast = Math.floor((Date.now() - new Date(lastLog.timestamp)) / (1000 * 60 * 60 * 24));
    if (daysSinceLast >= 2) {
      insights.push(`⏳ You haven’t logged in ${daysSinceLast} day${daysSinceLast > 1 ? 's' : ''}.`);
    }

    // Group by meal type
    const grouped = logs.reduce((acc, log) => {
      const meal = log.mealType;
      const glucose = Number(log.glucoseLevel);
      if (!meal || isNaN(glucose)) return acc;
      if (!acc[meal]) acc[meal] = [];
      acc[meal].push(glucose);
      return acc;
    }, {});

    const ALL_MEALS = ['Before Breakfast', 'After Breakfast', 'After Lunch', 'After Dinner'];

    // 1. No logs for some meal types
    ALL_MEALS.forEach(meal => {
      if (!grouped[meal]) {
        insights.push(`📭 No logs recorded for "${meal}".`);
      }
    });

    // 2. Consistently high readings
    for (const [meal, values] of Object.entries(grouped)) {
      const highCount = values.filter(v => v > HIGH_THRESHOLD).length;
      if (highCount >= Math.ceil(values.length / 2)) {
        insights.push(`⚠️ Your readings after ${meal.toLowerCase()} are often high.`);
      }
    }

    // 3. Highest variation (fluctuations)
    let mostFluctuating = null;
    let highestVariance = 0;

    for (const [meal, values] of Object.entries(grouped)) {
      const avg = values.reduce((a, b) => a + b, 0) / values.length;
      const variance = values.reduce((sum, v) => sum + Math.pow(v - avg, 2), 0) / values.length;
      if (variance > highestVariance) {
        highestVariance = variance;
        mostFluctuating = meal;
      }
    }

    if (mostFluctuating) {
      insights.push(`📉 Your readings vary the most after ${mostFluctuating.toLowerCase()}.`);
    }

    // 4. Most stable meal time
    let mostStable = null;
    let lowestVariance = Infinity;

    for (const [meal, values] of Object.entries(grouped)) {
      const avg = values.reduce((a, b) => a + b, 0) / values.length;
      const variance = values.reduce((sum, v) => sum + Math.pow(v - avg, 2), 0) / values.length;
      if (variance < lowestVariance) {
        lowestVariance = variance;
        mostStable = meal;
      }
    }

    if (mostStable) {
      insights.push(`🧘‍♀️ Your most stable readings are after ${mostStable.toLowerCase()}.`);
    }

    // 5. Lowest average readings
    let bestMeal = null;
    let lowestAvg = Infinity;

    for (const [meal, values] of Object.entries(grouped)) {
      const avg = values.reduce((a, b) => a + b, 0) / values.length;
      if (avg < lowestAvg) {
        lowestAvg = avg;
        bestMeal = meal;
      }
    }

    if (bestMeal) {
      insights.push(`✅ Your lowest average readings are after ${bestMeal.toLowerCase()}.`);
    }

    return insights;
  }, [logs]);

  if (suggestions.length === 0) return null;

  return (
    <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded shadow-sm">
      <h2 className="heading mb-2">💡 Smart Suggestions</h2>
      <ul className="list-disc list-inside text-sm text-gray-800 space-y-1">
        {suggestions.map((s, idx) => (
          <li key={idx}>{s}</li>
        ))}
      </ul>
    </div>
  );
};

export default SmartSuggestions;
