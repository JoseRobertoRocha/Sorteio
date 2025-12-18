document.getElementById("sorteioForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);

    // Ajuste do formato da data para o backend
    const dataInput = form.querySelector("input[name='data']").value;
    const formattedDate = dataInput.replace("T", " ") + ":00";

    formData.set("data", formattedDate);

    try {
        const response = await fetch("/admin/api/register/sweepsatake", {
            method: "POST",
            body: formData
        });

        const msg = document.getElementById("msg");

        if (response.ok) {
            msg.style.color = "green";
            msg.innerText = "Sorteio cadastrado com sucesso!";
            form.reset();
        } else {
            msg.style.color = "red";
            msg.innerText = "Erro ao cadastrar sorteio";
        }
    } catch (error) {
        console.error(error);
    }
});
