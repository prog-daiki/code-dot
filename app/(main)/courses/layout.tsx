interface CoursesLayoutProps {
  children: React.ReactNode;
}

const CoursesLayout = async ({ children }: CoursesLayoutProps) => {
  return (
    <div className="w-full">
      <div className="max-w-6xl mx-auto p-4">{children}</div>
    </div>
  );
};

export default CoursesLayout;
