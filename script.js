const ACCESS_PIN = "11111";
const ACCESS_SESSION_KEY = "nVisionSiteUnlocked";

const WORKSHOP_PINS = {
    // ضعي هنا رقمًا سريًا من خمسة أرقام لورشة المكالمة الاحترافية.
    "professional-call": "22222",
    // ضعي هنا رقمًا سريًا من خمسة أرقام لورشة الاستقطاب.
    recruitment: "33333",
    // ضعي هنا رقمًا سريًا من خمسة أرقام لورشة ردود الاعتراض.
    "objection-responses": "44444",
    // ضعي هنا رقمًا سريًا من خمسة أرقام لورشة تسجيل مستخدم جديد.
    "new-user-registration": "555",
    // ضعي هنا رقمًا سريًا من خمسة أرقام لورشة تعريف المنصة.
    "platform-introduction": "666",
    // ضعي هنا رقمًا سريًا من خمسة أرقام لورشة صناعة المحتوى.
    "content-creation": "777",
    // ضعي هنا رقمًا سريًا من خمسة أرقام لورشة المونتاج.
    "video-editing": "888",
    // ضعي هنا رقمًا سريًا من خمسة أرقام لورشة فتح ريدوت باي.
    redotpay: "99999",
};

const accessGate = document.querySelector(".access-gate");

if (accessGate instanceof HTMLElement) {
    const form = accessGate.querySelector("form");
    const pinInput = accessGate.querySelector('input[name="pin"]');
    const errorMessage = accessGate.querySelector(".access-error");
    const title = accessGate.querySelector(".access-title");
    const description = accessGate.querySelector(".access-description");
    const workshop = document.body.dataset.workshop;
    const workshopSessionKey = workshop ? `nVisionWorkshopUnlocked:${workshop}` : "";
    let stage = "site";

    try {
        const siteUnlocked = sessionStorage.getItem(ACCESS_SESSION_KEY) === "true";
        const workshopUnlocked = workshop
            && sessionStorage.getItem(workshopSessionKey) === "true";

        if (siteUnlocked && (!workshop || workshopUnlocked)) {
            document.body.classList.add("site-unlocked");
        } else if (siteUnlocked && workshop) {
            stage = "workshop";
        }
    } catch (error) {
        console.error("Unable to read the site access session.", error);
    }

    if (
        form instanceof HTMLFormElement
        && pinInput instanceof HTMLInputElement
        && errorMessage instanceof HTMLElement
        && title instanceof HTMLElement
        && description instanceof HTMLElement
    ) {
        const showWorkshopPrompt = () => {
            stage = "workshop";
            title.textContent = "كلمة سر الورشة";
            description.textContent = "أدخلي الرقم السري المكوّن من خمسة أرقام لفتح هذه الورشة.";
            pinInput.value = "";
            pinInput.setAttribute("aria-label", "كلمة سر الورشة");
            errorMessage.textContent = "";
            pinInput.focus();
        };

        if (stage === "workshop") {
            showWorkshopPrompt();
        }

        form.addEventListener("submit", (event) => {
            event.preventDefault();

            if (!/^\d{5}$/.test(pinInput.value)) {
                errorMessage.textContent = "أدخلي خمسة أرقام.";
                pinInput.focus();
                return;
            }

            if (stage === "site") {
                if (pinInput.value !== ACCESS_PIN) {
                    errorMessage.textContent = "الرقم السري غير صحيح، حاولي مرة أخرى.";
                    pinInput.value = "";
                    pinInput.focus();
                    return;
                }

                try {
                    sessionStorage.setItem(ACCESS_SESSION_KEY, "true");
                } catch (error) {
                    console.error("Unable to save the site access session.", error);
                }

                if (workshop) {
                    showWorkshopPrompt();
                } else {
                    errorMessage.textContent = "";
                    document.body.classList.add("site-unlocked");
                }
                return;
            }

            const workshopPin = workshop ? WORKSHOP_PINS[workshop] : "";

            if (!/^\d{5}$/.test(workshopPin)) {
                errorMessage.textContent = "لم تُعيّن كلمة سر لهذه الورشة بعد. ضعي رقمًا من خمسة أرقام في script.js.";
                return;
            }

            if (pinInput.value !== workshopPin) {
                errorMessage.textContent = "كلمة سر الورشة غير صحيحة، حاولي مرة أخرى.";
                pinInput.value = "";
                pinInput.focus();
                return;
            }

            try {
                sessionStorage.setItem(workshopSessionKey, "true");
            } catch (error) {
                console.error("Unable to save the workshop access session.", error);
            }

            errorMessage.textContent = "";
            document.body.classList.add("site-unlocked");
        });
    } else {
        throw new Error("The site access form is missing required elements.");
    }
}