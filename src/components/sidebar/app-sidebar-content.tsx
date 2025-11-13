"use client";

import { useMemo } from "react";
import { CaretRightIcon } from "@phosphor-icons/react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

export function AppSidebarContent({
  items,
}: {
  items: {
    title: string;
    icon?: React.ElementType;
    isActive?: boolean;
    items?: {
      title: string;
      icon?: React.ElementType;
      onClick?: () => void;
    }[];
  }[];
}) {
  // Memoize items to prevent unnecessary re-renders
  const memoizedItems = useMemo(() => items, [items]);

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Systems</SidebarGroupLabel>
      <SidebarMenu>
        {memoizedItems.map((item, systemIndex) => (
          <div
            key={item.title}
            className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:flex-col"
          >
            {/* Expanded view */}
            <div className="group-data-[collapsible=icon]:hidden">
              <Collapsible
                asChild
                defaultOpen={item.isActive}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      tooltip={item.title}
                      className="cursor-pointer"
                    >
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                      <CaretRightIcon className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items?.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton asChild>
                            <button
                              onClick={subItem.onClick}
                              className="w-full text-left cursor-pointer"
                            >
                              {subItem.icon && <subItem.icon />}
                              <span>{subItem.title}</span>
                            </button>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            </div>

            {/* Collapsed view - show sub-items as icons only */}
            <div className="hidden group-data-[collapsible=icon]:flex flex-col gap-1">
              {item.items?.map((subItem) => (
                <SidebarMenuButton
                  key={subItem.title}
                  onClick={subItem.onClick}
                  tooltip={`${item.title} / ${subItem.title}`}
                  className="px-2 cursor-pointer"
                >
                  {subItem.icon && <subItem.icon />}
                </SidebarMenuButton>
              ))}
            </div>

            {/* Separator only when collapsed, between systems */}
            {systemIndex < memoizedItems.length - 1 && (
              <Separator className="hidden group-data-[collapsible=icon]:block my-2 mx-1" />
            )}
          </div>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
