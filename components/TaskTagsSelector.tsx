"use client";

import { type Tag } from "@prisma/client";
import { useState } from "react";

import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { createNewTag } from "./TaskTagsSelectorAction";
import { Input } from "./ui/input";

export default function TaskTagsSelector({ existingTags }: {existingTags: Tag[]}) {

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  const [typedVal, setTypedVal] = useState('');

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <Input type="hidden" name="tags" value={value}></Input>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? existingTags.find((framework) => framework.name === value)?.name
            : "Select framework..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput onChangeCapture={(e) => setTypedVal(e.currentTarget.value)} placeholder="Search framework..." />
          <CommandList>
            <CommandEmpty>
              No framework found.
              {typedVal && <Button onClick={() => createNewTag(typedVal)}>Create &quot;{typedVal}&quot;</Button>}
            </CommandEmpty>
            <CommandGroup>
              {existingTags.map((framework) => (
                <CommandItem
                  key={framework.id}
                  value={framework.name}
                  onSelect={(currentValue: string) => {
                    setValue(currentValue === value ? '' : currentValue);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === framework.name ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {framework.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
