import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { ChevronDown, Download, Plus, Search } from "lucide-react";
import { Input } from "./ui/input";
import { RiColorFilterFill, RiFilter2Fill } from "react-icons/ri";

export function NewsletterHeader() {
  return (
    <div className="flex flex-col space-y-4">
        <div className="flex flex-wrap gap-2 justify-between">
      <div>
        <h1 className="text-2xl font-semibold">Newsletter Management</h1>
        <p className="text-sm text-gray-600">Create, edit, and manage your newsletters</p>
      </div>
<Button className="bg-[#862633] hover:bg-[#6f1a23] text-white lg:ml-auto">
        <Plus className="w-4 h-4" />
        Create Newsletter
      </Button>
        </div>

      <div className="flex flex-wrap gap-2 items-center justify-between bg-white p-4 px-6 rounded-md shadow-sm">
        <div className="flex flex-wrap gap-2 items-center space-x-4">
            <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Search newsletters..."
                      className="pl-10 w-80 text-sm"
                    />
                  </div>
              <Button variant="outline" className="flex items-center space-x-2">
                <span>All Statuses</span>
              </Button>

              <Button variant="outline" className="flex items-center space-x-2">
                <span>Newest First</span>
              </Button>
        </div>

        <div className="flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center">
                <RiFilter2Fill/> <span>More Filters</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>By Category</DropdownMenuItem>
              <DropdownMenuItem>By Author</DropdownMenuItem>
              <DropdownMenuItem>By Date Range</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="outline" className="flex items-center">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </Button>
        </div>
      </div>
    </div>
  );
}