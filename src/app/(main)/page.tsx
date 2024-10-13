"use client";

import { ContentLayout } from "@scylla-studio/components/composed/sidebar/content-layout";
import { Badge } from "@scylla-studio/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
} from "@scylla-studio/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@scylla-studio/components/ui/tooltip";
import {
  CheckCircle,
  Circle,
  GitCommit,
  Github,
  Linkedin,
  MinusCircle,
  PlusCircle,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import packageJson from "../../../package.json";

type PackageContributor = {
  name: string;
  github: string;
  linkedin?: string;
  openToWork: boolean;
  core: boolean;
};

type GithubContributor = {
  name: string;
  avatarUrl: string;
  github: string;
  additions: number;
  deletions: number;
  commits: number;
};

type MergedContributor = PackageContributor & GithubContributor;

export default function DashboardPage() {
  return (
    <ContentLayout title="Home">
      <Card>
        <CardContent>
          <DashboardHeader />
          <DashboardKeyFeatures />
          <DashboardContributors />
        </CardContent>
      </Card>
    </ContentLayout>
  );
}

function DashboardHeader() {
  return (
    <div className="flex md:flex-row flex-col space-x-2">
      <Image
        src="https://github.com/basementdevs/scylla-studio/raw/main/.github/assets/logo.png"
        alt="ScyllaDB Studio Logo"
        width="100"
        height="100"
      />
      <div>
        <CardHeader>
          <h1 className="font-bold">ScyllaDB Studio</h1>
          <p>
            a front-end application designed for the ScyllaDB ecosystem,
            inspired by tools like Drizzle and Prisma Studio. It provides an
            intuitive interface for managing your ScyllaDB keyspaces and tables,
            integrating essential performance metrics, and offering a unified
            solution to interact with both local and cloud-based ScyllaDB
            clusters.
          </p>
        </CardHeader>
      </div>
    </div>
  );
}

function DashboardKeyFeatures() {
  const features = [
    { name: "Visualize keyspaces and tables", status: "done" },
    { name: "Explore your data with a powerful query editor", status: "wip" },
    { name: "Visualize your data model", status: "wip" },
    { name: "Support for both local and cloud-based clusters", status: "done" },
    { name: "Keyspace Autocomplete based on Active Connection", status: "wip" },
    { name: "Query History", status: "wip" },
  ];

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-4">Key Features:</h2>
      <ul className="space-y-2">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center space-x-2">
            {feature.status === "done" ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <Circle className="h-5 w-5 text-yellow-500" />
            )}
            <span>{feature.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

const DashboardContributors = () => {
  const [contributors, setContributors] = useState<MergedContributor[]>([]);

  useEffect(() => {
    const fetchContributors = async () => {
      const response = await fetch(
        "https://api.github.com/repos/basementdevs/scylla-studio/stats/contributors",
      );

      /**
       * In 202 case, has nothing on reponse body.
       * In 403 case, we can't access the data or reach the rate limit.
       */
      if (response.status === 202 || response.status === 403) {
        return;
      }

      const data = await response.json();

      // Format the data from GitHub
      const githubContributors: GithubContributor[] = data?.map((item: any) => {
        // Sum up all weeks' data to get the all-time stats
        const totalAdditions = item.weeks.reduce(
          (sum: number, week: any) => sum + week.a,
          0,
        );
        const totalDeletions = item.weeks.reduce(
          (sum: number, week: any) => sum + week.d,
          0,
        );
        const totalCommits = item.weeks.reduce(
          (sum: number, week: any) => sum + week.c,
          0,
        );

        return {
          name: item.author.login,
          avatarUrl: item.author.avatar_url,
          github: item.author.login,
          additions: totalAdditions,
          deletions: totalDeletions,
          commits: totalCommits,
        };
      });

      const packageContributors: PackageContributor[] =
        packageJson.contributors;

      // Merge GitHub data with packageContributors based on 'github'
      const mergedContributors = packageContributors.map(
        (packageContributor) => {
          const githubContributor = githubContributors.find(
            (contributor) =>
              contributor.github.toLowerCase() ===
              packageContributor.github.toLowerCase(),
          );

          return {
            ...packageContributor,
            ...(githubContributor || {
              avatarUrl: "", // Default values if contributor is not found in GitHub data
              additions: 0,
              deletions: 0,
              commits: 0,
            }),
          };
        },
      );

      // Sort by commits in descending order
      const sortedContributors = mergedContributors.sort(
        (a, b) => b.commits - a.commits,
      );

      setContributors(sortedContributors);
    };

    fetchContributors();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 mt-5">Contributors:</h2>
      <div className="grid lg:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-5 grid-cols-1  md:grid-cols-2  gap-4">
        {contributors.map((contributor, index) => (
          <Card key={index} className="overflow-hidden">
            <div className="relative">
              <Image
                src={contributor.avatarUrl}
                alt={`${contributor.name}'s avatar`}
                className="w-full h-48 object-cover"
                loading="lazy"
                width="460"
                height="460"
              />
              {contributor.openToWork && (
                <div className="absolute top-2 left-2 bg-green-500 text-white text-xs py-1 px-2 rounded-md">
                  Open to Work
                </div>
              )}
            </div>
            <CardContent className="">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-lg">{contributor.name}</h3>
                {contributor.core && (
                  <Badge variant={"secondary"}>Core Member</Badge>
                )}
              </div>

              <div className="flex items-center space-x-3">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <div className="flex items-center text-green-600">
                        <PlusCircle className="w-4 h-4 mr-1" />
                        <span className="text-xs font-semibold">
                          {contributor.additions}
                        </span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{contributor.additions} Additions</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <div className="flex items-center text-red-600">
                        <MinusCircle className="w-4 h-4 mr-1" />
                        <span className="text-xs font-semibold">
                          {contributor.deletions}
                        </span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{contributor.deletions} Deletions</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <div className="flex items-center text-blue-600">
                        <GitCommit className="w-4 h-4 mr-1" />
                        <span className="text-xs font-semibold">
                          {contributor.commits}
                        </span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{contributor.commits} Commits</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <div className="mt-2">
                <div className="flex flex-row space-x-3 text-sm text-muted-foreground mb-4">
                  <a
                    href={`https://github.com/${contributor.github}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center hover:text-primary"
                  >
                    <Github className="w-10 h-5 mr-2" />
                  </a>
                  {contributor.linkedin && (
                    <a
                      href={`https://linkedin.com/in/${contributor.linkedin}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center hover:text-primary"
                    >
                      <Linkedin className="w-4 h-4 mr-2" />
                    </a>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
