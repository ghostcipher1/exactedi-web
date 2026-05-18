import { useState } from "react";

const FORM_URL = "/api/newsletter";

interface NewsletterFormProps {
  variant?: "inline" | "boxed";
  heading?: string;
  subtext?: string;
  buttonLabel?: string;
  successMessage?: string;
}

export default function NewsletterForm({
  variant = "inline",
  heading,
  subtext,
  buttonLabel = "Subscribe",
  successMessage = "You are subscribed!",
}: NewsletterFormProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || status === "submitting") return;

    setStatus("submitting");
    setErrorMsg("");

    try {
      const formData = new URLSearchParams();
      formData.append("email", email);

      const response = await fetch(FORM_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      });

      if (response.ok) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
        setErrorMsg("Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setErrorMsg("Network error. Please check your connection and try again.");
    }
  };

  const isBoxed = variant === "boxed";

  return (
    <div className={isBoxed ? "rounded-xl border border-stedi-gray-border bg-white p-6 md:p-8" : ""}>
      {heading && (
        <p className="text-sm font-semibold text-stedi-dark-text mb-1">{heading}</p>
      )}
      {subtext && (
        <p className="text-sm text-stedi-gray-text mb-4">{subtext}</p>
      )}

      {status === "success" ? (
        <div className="flex items-center gap-2 text-sm font-medium text-stedi-green">
          <div className="w-5 h-5 flex items-center justify-center rounded-full bg-stedi-green-light">
            <i className="ri-check-line text-xs" />
          </div>
          {successMessage}
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          data-readdy-form
          className={`flex flex-col sm:flex-row gap-2 ${isBoxed ? "max-w-md" : "max-w-md"}`}
        >
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="abc@xyz.com"
            required
            disabled={status === "submitting"}
            className="flex-1 px-4 py-2.5 text-sm rounded-lg border border-stedi-gray-border bg-white text-stedi-dark-text placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-stedi-green/30 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={status === "submitting"}
            className="px-5 py-2.5 text-sm font-medium rounded-lg bg-stedi-green text-white hover:bg-stedi-green-hover transition-colors whitespace-nowrap disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
          >
            {status === "submitting" ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Subscribing...
              </>
            ) : (
              buttonLabel
            )}
          </button>
        </form>
      )}

      {status === "error" && (
        <p className="mt-2 text-xs text-red-500">{errorMsg}</p>
      )}
    </div>
  );
}