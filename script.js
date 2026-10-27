const API_URL = "https://task-api-f8rr.onrender.com/tasks";

// ELEMENTOS DO DOM
const taskForm = document.querySelector("#taskForm");
const titleInput = document.querySelector("#title");
const descriptionInput = document.querySelector("#description");
const submitBtn = document.querySelector("#submitBtn");

const taskList = document.querySelector("#taskList");
const searchInput = document.querySelector("#searchInput");
const filterSelect = document.querySelector("#filterSelect");
const refreshBtn = document.querySelector("#refreshBtn");
const emptyState = document.querySelector("#emptyState");

const totalTasks = document.querySelector("#totalTasks");
const pendingTasks = document.querySelector("#pendingTasks");
const completedTasks = document.querySelector("#completedTasks");

const progressPercent = document.querySelector("#progressPercent");
const progressFill = document.querySelector("#progressFill");
const progressText = document.querySelector("#progressText");

const toast = document.querySelector("#toast");

// ESTADO DA APLICAÇÃO
let tasks = [];
let toastTimer;

// NOTIFICAÇÕES
function showToast(message, isError = false) {
    toast.textContent = message;
    toast.classList.toggle("error", isError);
    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 3500);
}

// FUNÇÃO PARA REQUISIÇÕES HTTP
async function apiRequest(url, options = {}) {
    const response = await fetch(url, options);

    if (!response.ok) {
        let detail = "";

        try {
            const errorBody = await response.json();
            detail = errorBody.message || errorBody.detail || "";
        } catch {
            // A resposta pode não conter JSON.
        }

        throw new Error(
            detail || `Erro HTTP ${response.status}`
        );
    }

    if (response.status === 204) {
        return null;
    }

    const contentType = response.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
        return response.json();
    }

    return null;
}

// GET - BUSCAR TODAS AS TAREFAS
async function loadTasks() {
    try {
        const data = await apiRequest(API_URL);

        if (!Array.isArray(data)) {
            throw new Error("Resposta inválida da API");
        }

        tasks = data;

        renderTasks();
        updateStats();

    } catch (error) {
        showToast("Erro ao buscar tarefas: " + error.message, true);
    }
}

// POST - CADASTRAR TAREFA
taskForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const title = titleInput.value.trim();
    const description = descriptionInput.value.trim();

    if (!title) {
        showToast("Informe o título da tarefa", true);
        return;
    }

    const newTask = {
        title: title,
        description: description,
        completed: false
    };

    submitBtn.disabled = true;
    submitBtn.textContent = "Salvando...";

    try {
        await apiRequest(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newTask)
        });

        taskForm.reset();

        showToast("Tarefa cadastrada com sucesso!");
        await loadTasks();

    } catch (error) {
        showToast("Erro ao cadastrar: " + error.message, true);

    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = "+ Adicionar tarefa";
    }
});

// PATCH - CONCLUIR TAREFA
async function completeTask(id) {
    try {
        await apiRequest(`${API_URL}/${id}/complete`, {
            method: "PATCH"
        });

        showToast("Tarefa concluída!");
        await loadTasks();

    } catch (error) {
        showToast("Erro ao concluir: " + error.message, true);
        await loadTasks();
    }
}

// DELETE - EXCLUIR TAREFA
async function deleteTask(id) {
    const confirmed = confirm(
        "Tem certeza que deseja excluir esta tarefa?"
    );

    if (!confirmed) return;

    try {
        await apiRequest(`${API_URL}/${id}`, {
            method: "DELETE"
        });

        showToast("Tarefa excluída!");
        await loadTasks();

    } catch (error) {
        showToast("Erro ao excluir: " + error.message, true);
    }
}

// CRIAR ELEMENTOS HTML PELO DOM
function createTaskElement(task) {
    const item = document.createElement("article");
    item.className = "task-item";

    if (task.completed) {
        item.classList.add("done");
    }

    // CHECKBOX
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "task-checkbox";
    checkbox.checked = task.completed;
    checkbox.disabled = task.completed;
    checkbox.setAttribute(
        "aria-label",
        `Concluir tarefa ${task.title}`
    );

    checkbox.addEventListener("change", async () => {
        if (checkbox.checked) {
            checkbox.disabled = true;
            await completeTask(task.id);
        }
    });

    // INFORMAÇÕES
    const info = document.createElement("div");
    info.className = "task-info";

    const title = document.createElement("h3");
    title.textContent = task.title || "Sem título";

    const description = document.createElement("p");
    description.textContent = task.description || "Sem descrição";

    info.append(title, description);

    // STATUS
    const status = document.createElement("span");
    status.className = "task-status";

    status.textContent = task.completed
        ? "Concluída"
        : "Pendente";

    // BOTÃO EXCLUIR
    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-btn";
    deleteButton.textContent = "Excluir";

    deleteButton.addEventListener("click", async () => {
        deleteButton.disabled = true;
        await deleteTask(task.id);
        deleteButton.disabled = false;
    });

    item.append(checkbox, info, status, deleteButton);

    return item;
}

// RENDERIZAR TAREFAS
function renderTasks() {
    const search = searchInput.value.toLowerCase().trim();
    const filter = filterSelect.value;

    const filteredTasks = tasks.filter(task => {
        const title = (task.title || "").toLowerCase();
        const description = (task.description || "").toLowerCase();

        const matchesSearch =
            title.includes(search) ||
            description.includes(search);

        let matchesFilter = true;

        if (filter === "completed") {
            matchesFilter = task.completed;
        }

        if (filter === "pending") {
            matchesFilter = !task.completed;
        }

        return matchesSearch && matchesFilter;
    });

    taskList.replaceChildren();

    filteredTasks.forEach(task => {
        const element = createTaskElement(task);
        taskList.appendChild(element);
    });

    emptyState.hidden = filteredTasks.length > 0;
}

// ATUALIZAR ESTATÍSTICAS
function updateStats() {
    const total = tasks.length;

    const completed = tasks.filter(task => task.completed).length;

    const pending = total - completed;

    const percentage = total === 0
        ? 0
        : Math.round((completed / total) * 100);

    totalTasks.textContent = total;
    pendingTasks.textContent = pending;
    completedTasks.textContent = completed;

    progressPercent.textContent = `${percentage}%`;
    progressFill.style.width = `${percentage}%`;

    progressText.textContent = total === 0
        ? "Nenhuma tarefa cadastrada."
        : `${completed} de ${total} tarefas concluídas.`;
}

// EVENTOS DE PESQUISA E FILTRO
searchInput.addEventListener("input", renderTasks);

filterSelect.addEventListener("change", renderTasks);

refreshBtn.addEventListener("click", async () => {
    await loadTasks();
});

// CARREGAR TAREFAS AO ABRIR A PÁGINA
loadTasks();
