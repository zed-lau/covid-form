import React, { FC, useState, useCallback, useEffect } from "react";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { getSubmissionResponses } from "../api/questionnaire";
import "./QuestionnaireResponseView.css";
import { Question } from "../types";
import { Link } from "react-router-dom";

const buttonSx = {
  borderRadius: "0.5em",
  "&:hover": {
    backgroundColor: "white",
    color: "primary.main",
  },
};

export const QuestionnaireResponseView: FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [responses, setResponses] = useState<Record<string, string>[]>([]);
  const questionnaireId = Number(import.meta.env.VITE_QUESTIONNAIRE_ID);

  const fetchSubmissionResponses = useCallback(async () => {
    const submissionResponses = await getSubmissionResponses(questionnaireId);
    setQuestions(submissionResponses.questions);
    setResponses(submissionResponses.responses);
  }, []);
  useEffect(() => {
    fetchSubmissionResponses();
  }, [fetchSubmissionResponses]);

  return (
    <div className="questionnaire-response-view__container">
      <div className="questionnaire-response-view__header">
        <h2>Responses</h2>
      </div>
      <div className="questionnaire-response-view__content">
        <TableContainer sx={{ maxHeight: "25em" }}>
          <Table stickyHeader className="questionnaire-response-view__table">
            <TableHead>
              <TableRow>
                {questions?.map((question) => (
                  <TableCell className="questionnaire-response-view__table-header-cell">
                    {question.text}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {responses.length > 0 ? (
                responses.map((response) => (
                  <TableRow>
                    {questions?.map((question) => (
                      <TableCell>{response[question.id]}</TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={questions.length}
                    className="questionnaire-response-view__no-record-table-cell"
                  >
                    No records found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <div className="questionnaire-response-view__buttons">
          <Button
            sx={buttonSx}
            className="questionnaire-response-view__button"
            variant="contained"
            component={Link}
            to="/"
          >
            Return
          </Button>
        </div>
      </div>
    </div>
  );
};
