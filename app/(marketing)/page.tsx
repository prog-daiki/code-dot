import { Button } from "@/components/ui/button";
import { SignInButton } from "@clerk/nextjs";
import Image from "next/image";

const MarketingPage = async () => {
  return (
    <div className="flex flex-col items-center justify-center max-w-5xl mx-auto mt-16">
      <div className="flex flex-col md:flex-row items-center justify-center gap-8">
        <div className="flex flex-col items-center md:items-start gap-4">
          <h1 className="text-xl md:text-2xl font-bold">必要な講座を、必要な分だけ</h1>
          <h2 className="text-md md:text-2xl text-slate-600">効率的に学習を進めましょう</h2>
          <SignInButton forceRedirectUrl="/courses" mode="modal">
            <Button className="flex items-center gap-x-2 text-md">無料で始める</Button>
          </SignInButton>
        </div>
        <Image src="/images/hero.png" alt="marketing" width={500} height={500} className="rounded-md" priority />
      </div>

      <div className="border-t bg-slate-50 p-4 mb-16">
        <div className="max-w-5xl mx-auto py-16">
          <h3 className="text-3xl font-bold text-center mb-8">特徴</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "柔軟な学習",
                description: "自分のペースで学習を進められます",
                icon: "🎯",
              },
              {
                title: "実践的なコンテンツ",
                description: "現場で使える実践的な内容",
                icon: "💻",
              },
              {
                title: "専門家のサポート",
                description: "質問への迅速な回答",
                icon: "🤝",
              },
            ].map((feature) => (
              <div key={feature.title} className="bg-white border rounded-xl p-6 hover:shadow-lg transition">
                <div className="text-3xl mb-4 text-center">{feature.icon}</div>
                <h4 className="text-xl font-medium mb-2">{feature.title}</h4>
                <p className="text-slate-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketingPage;
