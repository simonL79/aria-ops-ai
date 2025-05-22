
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

interface BlogCardProps {
  title: string;
  description: string;
  image: string;
  date: string;
  category: string;
  slug: string;
}

const BlogCard = ({ title, description, image, date, category, slug }: BlogCardProps) => {
  return (
    <Card className="h-full flex flex-col overflow-hidden transition-all hover:shadow-md">
      <div className="aspect-video w-full overflow-hidden">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover transition-transform hover:scale-105" 
        />
      </div>
      <CardHeader>
        <div className="flex items-center text-xs text-premium-gray mb-2">
          <span>{date}</span>
          <span className="mx-2">•</span>
          <span className="text-blue-600 font-medium">{category}</span>
        </div>
        <CardTitle className="text-xl mb-2">{title}</CardTitle>
        <CardDescription className="line-clamp-2">{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        {/* Content can be added here if needed */}
      </CardContent>
      <CardFooter className="pt-0">
        <Button variant="link" className="px-0 text-blue-600" asChild>
          <Link to={`/blog/${slug}`} className="flex items-center">
            Read more <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BlogCard;
