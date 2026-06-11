function ATSScore({ atsScore }) {
  if (atsScore <= 0) return null;

  return (
    <div className="mt-6 bg-green-100 border border-green-300 p-4 rounded-lg">
      <h2 className="text-xl font-bold">
        ATS Score: {atsScore}/100
      </h2>

      <div className="w-full bg-gray-300 rounded-full h-4 mt-3">
        <div
          className="bg-green-600 h-4 rounded-full"
          style={{ width: `${atsScore}%` }}
        ></div>
      </div>
    </div>
  );
}

export default ATSScore;