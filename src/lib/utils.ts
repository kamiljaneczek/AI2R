import "dotenv/config";

const config = {
  apiKey: process.env.TASKS_API_KEY,
  token: "",
  url: process.env.AI_DEVS_URL,
};

export async function authorize(taskName: string): Promise<string | null> {
  try {
    const response = await fetch(`${config.url}/token/${taskName}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        apikey: process.env.AI_DEVS_API_KEY,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    const data = (await response.json()) as { token: string };
    console.log("Token: ", data);
    config.token = data.token;
    return data.token;
  } catch (error) {
    console.error("Error fetching token:", error);
    return null;
  }
}

export async function getQuestion(token: string) {
  // replace all oocurance of - with / in token
  token = token.replace(/-/g, "/");
  try {
    const response = await fetch(`${config.url}/task/${config.token}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }

    const data = await response.json();
    console.log("Task data: ", data);
    return data;
  } catch (error) {
    console.error("Error fetching task data:", error);
    return null;
  }
}

export async function setAnswer(token: string, answer: any) {
  token = token.replace(/-/g, "/");

  try {
    const response = await fetch(`${config.url}/answer/${config.token}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        answer: answer,
      }),
    });
    const data = await response.json();
    console.log("send_answer data: ", data);
    return data;
  } catch (error) {
    console.error("Error fetching task data:", error);
    return null;
  }
}
