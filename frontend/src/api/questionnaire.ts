import { Submission } from "../types";

export const createResponse = async (body: Submission) => {
  const url = "http://localhost:3000/submission";
  const options = {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json;charset=UTF-8",
    },
    body: JSON.stringify(body),
  };
  const response = await fetch(url, options);
  return response.json();
};

export const getQuestionnaire = async (id: number) => {
  const url = `http://localhost:3000/questionnaire/${id}`;
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
    },
  };
  const response = await fetch(url, options);
  return response.json();
};

export const getSubmissionResponses = async (questionnaireId: number) => {
  const queryParams = new URLSearchParams({
    questionnaireId: String(questionnaireId),
  });
  const url = `http://localhost:3000/submission/responses?${queryParams}`;
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
    },
  };
  const response = await fetch(url, options);
  return response.json();
};
