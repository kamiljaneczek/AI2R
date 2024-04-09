export const taskSchema = {
  name: "createTask",
  description: `Create task for user. Use ToDo as tool always. Get desc of task from user.`,
  parameters: {
    type: "object",
    properties: {
      tool: {
        type: "string",
        desc: `tool field has always fixed value equal to ToDo. Use always this value and nothing else.`,
      },
      desc: {
        type: "string",
        description: `Description of the task`,
      },
    },
    required: ["name", "tool", "desc"],
  },
};

export const eventSchema = {
  name: "createEvent",
  description: `Create event for user. Use Calendar as tool always. Get desc of event from user.`,
  parameters: {
    type: "object",
    properties: {
      tool: {
        type: "string",
        description: `tool field has always fixed value equal to Calendar. Use always this value and nothing else.`,
      },
      desc: {
        type: "string",
        description: `Description of the event`,
      },
      date: {
        type: "string",
        description: `Date of event in format YYYY-MM-DD`,
      },
    },
    required: ["name", "tool", "desc", "date"],
  },
};
