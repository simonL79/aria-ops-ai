
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { ArrowRight, FileText } from "lucide-react";

interface BlogCardProps {
  title: string;
  description: string;
  image: string;
  date: string;
  category: string;
  slug: string;
}

const BlogCard = ({ title, description, image, date, category, slug }: BlogCardProps) => {
  const isWhitePaper = category === "White Paper" || title.includes("[WHITE PAPER]");
  
  return (
    <Card className={`h-full flex flex-col overflow-hidden transition-all hover:shadow-md ${isWhitePaper ? 'border-amber-400 bg-amber-50/50' : ''}`}>
      <div className="aspect-video w-full overflow-hidden relative">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover transition-transform hover:scale-105" 
        />
        {isWhitePaper && (
          <div className="absolute top-2 right-2">
            <Badge variant="secondary" className="bg-amber-400 text-black font-semibold">
              <FileText className="h-3 w-3 mr-1" />
              WHITE PAPER
            </Badge>
          </div>
        )}
      </div>
      <CardHeader>
        <div className="flex items-center text-xs text-premium-gray mb-2">
          <span>{date}</span>
          <span className="mx-2">•</span>
          <span className={`font-medium ${isWhitePaper ? 'text-amber-700' : 'text-blue-600'}`}>
            {category}
          </span>
        </div>
        <CardTitle className={`text-xl mb-2 ${isWhitePaper ? 'text-amber-900' : ''}`}>
          {title}
        </CardTitle>
        <CardDescription className="line-clamp-2">{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        {/* Content can be added here if needed */}
      </CardContent>
      <CardFooter className="pt-0">
        <Button 
          variant="link" 
          className={`px-0 ${isWhitePaper ? 'text-amber-700 hover:text-amber-800' : 'text-blue-600'}`} 
          asChild
        >
          <Link to={`/blog/${slug}`} className="flex items-center">
            {isWhitePaper ? 'Read White Paper' : 'Read more'} 
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BlogCard;
