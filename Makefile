DOCKER_COMMAND := $(shell command -v docker 2> /dev/null)
PNPM := $(shell command -v pnpm 2> /dev/null)

# Default target
.DEFAULT_GOAL := help

.PHONY: help
help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

.PHONY: docker-up
docker-up: ## Starts a cluster with ScyllaDB and NextJS
	@$(DOCKER_COMMAND) compose --file docker-compose.yml up --detach

.PHONY: docker-down
docker-down: ## Stops the cluster and removes the volumes and images
	@$(DOCKER_COMMAND) compose --file docker-compose.yml down --volumes --rmi local

.PHONY: node-nt-status
node-nt-status: ## Shows ScyllaDB nodetool status
	@$(DOCKER_COMMAND) compose --file docker-compose.yml exec scylla-node nodetool status

.PHONY: cqlsh
cqlsh: ## Enters ScyllaDB CQLSH
	@$(DOCKER_COMMAND) compose --file docker-compose.yml exec -it scylla-node cqlsh

.PHONY: scylla-logs
scylla-logs: ## Shows ScyllaDB logs
	@$(DOCKER_COMMAND) compose --file docker-compose.yml logs --follow

.PHONY: lint
lint: ## Lint the project
	@$(PNPM) run check

.PHONY: lint-fix
lint-fix: ## Lint the project and fix the issues
	@$(PNPM) run check:fix

.PHONY: trigger-ci
trigger-ci: ## Trigger the CI pipeline
	@$(PNPM) run trigger:ci

.PHONY: dev
dev: ## Starts the development server
	@$(PNPM) run dev
