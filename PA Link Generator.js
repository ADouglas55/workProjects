const inputBody = document.getElementById("inputBody");
const outputBody = document.getElementById("outputBody");

const sameMaterial = document.getElementById("sameMaterial");
const sameSTP = document.getElementById("sameSTP");

const addRowButton = document.getElementById("addRowButton");
const generateButton = document.getElementById("generateButton");
const clearButton = document.getElementById("clearButton");
const copyButton = document.getElementById("copyButton");

const outputSection = document.getElementById("outputSection");
const message = document.getElementById("message");


// ---------------------------
// ADD ROW
// ---------------------------

function addRow() {

    const row = document.createElement("tr");

    row.innerHTML = `
        <td>
            <input
                type="text"
                class="material">
        </td>

        <td>
            <input
                type="text"
                class="stp">
        </td>

        <td>
            <input
                type="text"
                class="program">
        </td>

        <td>
            <input
                type="text"
                class="Level">
        </td>

        <td>
            <input
                type="text"
                class="sketch">
        </td>

        <td>
            <button type="button" class="deleteButton">
                Delete
            </button>
        </td>
    `;

    const deleteButton = row.querySelector(".deleteButton");

    deleteButton.addEventListener("click", function() {

        const rows = inputBody.querySelectorAll("tr");

        if (rows.length > 1) {

            row.remove();

        } else {

            row.querySelector(".material").value = "";
            row.querySelector(".stp").value = "";
            row.querySelector(".program").value = "";
            row.querySelector(".sketch").value = "";

        }

    });

    inputBody.appendChild(row);

    applySharedValues();

}


// ---------------------------
// SHARED VALUES
// ---------------------------

function applySharedValues() {

    const rows = inputBody.querySelectorAll("tr");

    if (rows.length === 0) {
        return;
    }

    const firstMaterial =
        rows[0].querySelector(".material").value;

    const firstSTP =
        rows[0].querySelector(".stp").value;


    rows.forEach(function(row, index) {

        const material = row.querySelector(".material");
        const stp = row.querySelector(".stp");

        if (index === 0) {

            material.disabled = false;
            stp.disabled = false;

            material.classList.remove("shared");
            stp.classList.remove("shared");

            return;

        }


        if (sameMaterial.checked) {

            material.value = firstMaterial;
            material.disabled = true;
            material.classList.add("shared");

        } else {

            material.disabled = false;
            material.classList.remove("shared");

        }


        if (sameSTP.checked) {

            stp.value = firstSTP;
            stp.disabled = true;
            stp.classList.add("shared");

        } else {

            stp.disabled = false;
            stp.classList.remove("shared");

        }

    });

}


// ---------------------------
// GENERATE TABLE
// ---------------------------

function generateTable() {

    applySharedValues();

    outputBody.innerHTML = "";

    const rows = inputBody.querySelectorAll("tr");

    let generated = 0;


    rows.forEach(function(row) {

        const material =
            row.querySelector(".material").value.trim();

        const stp =
            row.querySelector(".stp").value.trim();

        const program =
            (row.querySelector(".program").value.trim())

        const sketch =
            row.querySelector(".sketch").value.trim();


        if (!material || !stp) {
            return;
        }


        const url =
            "https://awards.octanner.net/kits/proof" +
            "?award_id=0" +
            "&step_id=0" +
            "&material_number=" +
            encodeURIComponent(material) +
            "&stp=" +
            encodeURIComponent(stp) +
            "&program_id=" +
            encodeURIComponent(program) +
            "&level_id=" +
            "&level_name=" +
            "&sketch_number=" +
            encodeURIComponent(sketch) +
            "&locale=en_US";


        const outputRow = document.createElement("tr");

        const stpCell = document.createElement("td");
            stpCell.textContent = stp;

        const materialCell = document.createElement("td");
            materialCell.textContent = material;

        const sketchCell = document.createElement("td");
            sketchCell.textContent = sketch;


        const proofCell = document.createElement("td");

        const link = document.createElement("a");

        link.href = url;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.textContent = "View Proof";
        link.className = "proofLink";


        proofCell.appendChild(link);

        outputRow.appendChild(stpCell);
        outputRow.appendChild(materialCell);
        outputRow.appendChild(sketchCell);
        outputRow.appendChild(proofCell);

        outputBody.appendChild(outputRow);

        generated++;

    });


    if (generated > 0) {

        outputSection.style.display = "block";

        message.style.color = "green";

        message.textContent =
            generated +
            (generated === 1
                ? " proof generated."
                : " proofs generated.");

    } else {

        outputSection.style.display = "none";

        message.style.color = "red";

        message.textContent =
            "Complete Material Number, STP for at least one row.";

    }

}


// ---------------------------
// COPY TABLE
// ---------------------------

async function copyTable() {

    const table =
        document.getElementById("Table");

    const html = table.outerHTML;

    let plainText =
        "STP\tMaterial Number\tSketch\tProof\n";


    const rows =
        outputBody.querySelectorAll("tr");

    rows.forEach(function(row) {

        const cells = row.querySelectorAll("td");

        const stp =
            cells[0].textContent;

        const material =
            cells[1].textContent;

        const sketch =
            cells[2].textContent;

        const link =
            cells[3].querySelector("a");

        plainText +=
            stp + "\t" +
            material + "\t" +
            sketch + "\t" +
            link.href + "\n";

    });


    try {

        const htmlBlob =
            new Blob(
                [html],
                { type: "text/html" }
            );

        const textBlob =
            new Blob(
                [plainText],
                { type: "text/plain" }
            );


        const clipboardItem =
            new ClipboardItem({

                "text/html": htmlBlob,

                "text/plain": textBlob

            });


        await navigator.clipboard.write([
            clipboardItem
        ]);


        message.style.color = "green";

        message.textContent =
            "Table copied!";

    }

    catch (error) {

        message.style.color = "red";

        message.textContent =
            "Your browser blocked table copying. Try selecting the generated table and copying it manually.";

    }

}


// ---------------------------
// CLEAR
// ---------------------------

function clearAll() {

    inputBody.innerHTML = "";
    outputBody.innerHTML = "";

    sameMaterial.checked = false;
    sameSTP.checked = false;

    outputSection.style.display = "none";

    message.textContent = "";

    addRow();

}


// ---------------------------
// EVENTS
// ---------------------------

addRowButton.addEventListener(
    "click",
    addRow
);

generateButton.addEventListener(
    "click",
    generateTable
);

clearButton.addEventListener(
    "click",
    clearAll
);

copyButton.addEventListener(
    "click",
    copyTable
);


sameMaterial.addEventListener(
    "change",
    applySharedValues
);

sameSTP.addEventListener(
    "change",
    applySharedValues
);


// Automatically update shared values
inputBody.addEventListener(
    "input",
    function(event) {

        const firstRow =
            inputBody.querySelector("tr");

        if (!firstRow) {
            return;
        }


        if (
            sameMaterial.checked &&
            event.target ===
            firstRow.querySelector(".material")
        ) {
            applySharedValues();
        }


        if (
            sameSTP.checked &&
            event.target ===
            firstRow.querySelector(".stp")
        ) {
            applySharedValues();
        }

    }
);


// Start with one row
addRow();