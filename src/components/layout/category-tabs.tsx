"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToolCard } from "@/components/layout/tool-card";
import { Tool, ToolCategory, getToolsByCategory, getAvailableTools, getToolUrl } from "@/lib/tools";
import { Wrench, ArrowRightLeft, Dices, CheckCircle, Calculator } from "lucide-react";

interface CategoryTabsProps {
  locale: string;
  dictionary: {
    categories: {
      available: string;
      tools: string;
      converters: string;
      randomizers: string;
      calculators: string;
    };
    tools: Record<string, { name: string; description: string }>;
    common: {
      comingSoon: string;
    };
  };
}

export function CategoryTabs({ locale, dictionary }: CategoryTabsProps) {
  const availableTools = getAvailableTools();
  const toolsCategory = getToolsByCategory("tools");
  const convertersCategory = getToolsByCategory("converters");
  const randomizersCategory = getToolsByCategory("randomizers");
  const calculatorsCategory = getToolsByCategory("calculators");

  const renderToolGrid = (tools: Tool[]) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {tools.map((tool) => {
        const toolDict = dictionary.tools[tool.id];
        return (
          <ToolCard
            key={tool.id}
            href={getToolUrl(tool, locale)}
            icon={tool.icon}
            name={toolDict?.name || tool.id}
            description={toolDict?.description || ""}
            isReady={tool.isReady}
            comingSoonLabel={dictionary.common.comingSoon}
          />
        );
      })}
    </div>
  );

  return (
    <Tabs defaultValue="available" className="w-full">
      <TabsList className="grid w-full max-w-3xl mx-auto grid-cols-5 mb-8">
        <TabsTrigger value="available" className="gap-2">
          <CheckCircle className="h-4 w-4" />
          {dictionary.categories.available}
        </TabsTrigger>
        <TabsTrigger value="tools" className="gap-2">
          <Wrench className="h-4 w-4" />
          {dictionary.categories.tools}
        </TabsTrigger>
        <TabsTrigger value="converters" className="gap-2">
          <ArrowRightLeft className="h-4 w-4" />
          {dictionary.categories.converters}
        </TabsTrigger>
        <TabsTrigger value="randomizers" className="gap-2">
          <Dices className="h-4 w-4" />
          {dictionary.categories.randomizers}
        </TabsTrigger>
        <TabsTrigger value="calculators" className="gap-2">
          <Calculator className="h-4 w-4" />
          {dictionary.categories.calculators}
        </TabsTrigger>
      </TabsList>
      <TabsContent value="available">
        {renderToolGrid(availableTools)}
      </TabsContent>
      <TabsContent value="tools">
        {renderToolGrid(toolsCategory)}
      </TabsContent>
      <TabsContent value="converters">
        {renderToolGrid(convertersCategory)}
      </TabsContent>
      <TabsContent value="randomizers">
        {renderToolGrid(randomizersCategory)}
      </TabsContent>
      <TabsContent value="calculators">
        {renderToolGrid(calculatorsCategory)}
      </TabsContent>
    </Tabs>
  );
}
