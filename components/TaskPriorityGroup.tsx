import { useState, Fragment, useEffect } from "react";
import { Transition, Combobox } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { Bars3BottomRightIcon } from "@heroicons/react/24/solid";
import { useBoardStore } from "@/store/BoardStore";
import { useModalTaskDetail } from "@/store/ModalTaskDetail";
const priority = [
  { id: "1", name: "High" },
  { id: "2", name: "Medium" },
  { id: "3", name: "Low" },
];

function TaskPriorityGroup() {
  const [setPriorityTask, priorityTask] = useBoardStore((state) => [
    state.setPriorityTask,
    state.priorityTask,
  ]);
  const [isOpenModal] = useModalTaskDetail((state) => [state.isOpenModal]);
  const found = priority.find((element) => element.id === priorityTask);
  const [selected, setSelected] = useState(found || priority[0]);
  const [query, setQuery] = useState("");
  const filteredPeople =
    query === ""
      ? priority
      : priority.filter((item) =>
          item.name
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(query.toLowerCase().replace(/\s+/g, ""))
        );
  useEffect(() => {
    setPriorityTask(selected.id);
  }, [selected]);
  return (
    <div className="mt-2 focus-visible:outline-none">
      <div className="flex items-center justify-start font-semibold">
        <Bars3BottomRightIcon className="w-5 h-5"></Bars3BottomRightIcon>
        Priority
      </div>
      <Combobox value={selected} onChange={setSelected}>
        <div className="relative mt-1 focus-visible:outline-none">
          <div className="relative focus-visible:outline-none w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
            <Combobox.Input
              className={`w-full font-semibold focus-visible:outline-none border-none py-2 pl-3 pr-10 text-sm leading-5 focus:ring-0
                             ${selected.name === "High" && "text-red-500"}
                             ${
                               selected.name === "Medium" && "text-yellow-500"
                             }  
                             ${selected.name === "Low" && "text-green-500"}
                          `}
              displayValue={(person: any) => person?.name}
              onChange={(event) => setQuery(event.target.value)}
              readOnly={isOpenModal}
            />
            <Combobox.Button
              aria-disabled={isOpenModal}
              className="absolute inset-y-0 right-0 flex items-center pr-2"
            >
              <ChevronUpDownIcon
                className="h-5 w-5 text-gray-600"
                aria-hidden="true"
              />
            </Combobox.Button>
          </div>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterLeave={() => setQuery("")}
          >
            <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {filteredPeople.length === 0 && query !== "" ? (
                <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                  Nothing found.
                </div>
              ) : (
                filteredPeople.map((person) => (
                  <Combobox.Option
                    key={person.id}
                    className={({ active }) =>
                      `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                        active ? "bg-teal-600 text-white" : "text-gray-900"
                      }`
                    }
                    value={person}
                  >
                    {({ selected, active }) => (
                      <>
                        <span
                          className={`block truncate ${
                            selected ? "font-medium" : "font-normal"
                          }`}
                        >
                          {person.name}
                        </span>
                        {selected ? (
                          <span
                            className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                              active ? "text-white" : "text-teal-600"
                            }`}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Combobox.Option>
                ))
              )}
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
    </div>
  );
}

export default TaskPriorityGroup;
