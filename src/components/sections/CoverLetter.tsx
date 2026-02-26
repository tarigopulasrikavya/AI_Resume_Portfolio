type Props = {
  profile?: {
    fullName?: string;
    title?: string;
    summary?: string;
  };
  skills?: string[];
};

export default function CoverLetter({ profile, skills }: Props) {
  const today = new Date().toLocaleDateString();

  const jobTitle = profile?.title ?? "Software Developer";
  const fullName = profile?.fullName ?? "Your Name";
  const summary = profile?.summary ?? "";
  const skillsText =
    skills && skills.length > 0
      ? skills.join(", ")
      : "software development";

  const letter = `
${today}

Dear Hiring Manager,

I am writing to express my interest in the ${jobTitle} position.

With strong expertise in ${skillsText}, I am confident in my ability to contribute effectively to your team.

${summary}

I am excited about the opportunity to bring my skills and passion to your organization.

Sincerely,
${fullName}
`;

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-lg p-10 text-gray-800 rounded-lg border">
      <h2 className="text-2xl font-bold border-b-2 border-gray-800 pb-2 mb-6">
        COVER LETTER
      </h2>

      <div className="whitespace-pre-line leading-relaxed text-gray-700">
        {letter}
      </div>
    </div>
  );
}