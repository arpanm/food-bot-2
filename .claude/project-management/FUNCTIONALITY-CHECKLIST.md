# Functionality Checklist

This file is used by the test report to show which functionalities are tested, passed, failed, skipped, or not implemented.  
The report generator updates the **Status** column from the last test run.

| #   | Functionality                                            | Area               | Test Suite                         | Status          |
| --- | -------------------------------------------------------- | ------------------ | ---------------------------------- | --------------- |
| 1   | API Gateway health endpoint                              | Backend            | api-gateway                        | Not run         |
| 2   | Customer Service health                                  | Backend            | customer-service                   | Not run         |
| 3   | Restaurant Service health                                | Backend            | restaurant-service                 | Not run         |
| 4   | Order Service health                                     | Backend            | order-service                      | Not run         |
| 5   | Workflow Service health                                  | Backend            | workflow-service                   | Not run         |
| 6   | Search Service health                                    | Backend            | search-service                     | Not run         |
| 7   | LLM Service health                                       | Backend            | llm-service                        | Not run         |
| 8   | MCP Service health                                       | Backend            | mcp-service                        | Not run         |
| 9   | Personalization Service health                           | Backend            | personalization-service            | Not run         |
| 10  | Customer App shell / title + nav                         | Frontend           | customer-app                       | Not run         |
| 11  | Restaurant App Dashboard / Menu / Orders / Analytics     | Frontend           | restaurant-app                     | Not run         |
| 12  | Chat UI components + input + Send                        | Frontend           | customer-app                       | Not run         |
| 13  | Job polling (submitPrompt, getJobStatus)                 | Frontend           | customer-app                       | Not run         |
| 14  | API Gateway Chat + Jobs + Restaurants + Orders endpoints | Backend            | api-gateway                        | Not run         |
| 15  | Party planner flow                                       | Frontend           | customer-app                       | Not implemented |
| 16  | Diet planner flow                                        | Frontend           | customer-app                       | Not implemented |
| 17  | Order flow (cart, checkout)                              | Backend + Frontend | order-service, customer-app        | Not implemented |
| 18  | Restaurant onboarding                                    | Backend + Frontend | restaurant-service, restaurant-app | Not implemented |
| 19  | Menu CRUD                                                | Backend            | restaurant-service                 | Not implemented |
| 20  | Search / filters                                         | Backend            | search-service                     | Not implemented |
| 21  | Workflow execution (Temporal)                            | Backend            | workflow-service, temporal         | Not implemented |
| 22  | LLM intent / workflow generation                         | Backend            | llm-service                        | Not implemented |
| 23  | MCP routing (internal/Swiggy/Zomato)                     | Backend            | mcp-service                        | Not implemented |
| 24  | User preference graph                                    | Backend            | personalization-service            | Not implemented |
| 25  | Mock Swiggy MCP                                          | Mocks              | mock-swiggy-mcp                    | Not run         |
| 26  | Mock Zomato MCP                                          | Mocks              | mock-zomato-mcp                    | Not run         |
| 27  | Mock ONDC MCP                                            | Mocks              | mock-ondc-mcp                      | Not run         |

**Status values:** `Passed` | `Failed` | `Skipped` | `Not run` | `Not implemented`
