const recommendBtn = document.querySelector("#recommendBtn");
const movieTitleInput = document.querySelector("#movieTitle");
const aiResult = document.querySelector("#aiResult");

const OPENAI_API_KEY = "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";
const OPENAI_URL = "https://api.openai.com/v1/chat/completions";

recommendBtn.addEventListener("click", async function () {
  // trim()은 앞뒤 공백을 제거합니다.
  const movieTitle = movieTitleInput.value.trim();

  // 입력값이 비어 있으면 요청하지 않습니다.
  if (movieTitle === "") {
    alert("영화 제목을 입력하세요.");
    return;
  }

  try {
    // 요청 시작 안내 문구입니다.
    aiResult.textContent = "AI가 추천 문구를 만드는 중입니다.";

    // 실습 1: 요청 중 버튼을 비활성화합니다.
    // 같은 요청이 여러 번 중복 실행되는 것을 막기 위해서입니다.
    recommendBtn.disabled = true;

    const response = await fetch(OPENAI_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: `${movieTitle} 영화 줄거리를 10문장정도로 작성해줘.`
          }
        ]
      })
    });

    // 응답을 JSON으로 변환합니다.
    const data = await response.json();

    // 실습 2: API 요청이 성공했는지 확인합니다.
    // response.ok는 HTTP 상태 코드가 성공 범위인지 알려줍니다.
    if (!response.ok) {
      // 실패 원인을 Console에서 확인합니다.
      console.log(data);

      // OpenAI가 보내준 오류 메시지가 있으면 보여줍니다.
      aiResult.textContent = data.error?.message || "API 요청에 실패했습니다.";
      return;
    }

    // 성공 응답에서 텍스트를 찾습니다.
    const message = data.choices?.[0]?.message?.content;

    // 찾은 텍스트를 화면에 표시합니다.
    aiResult.textContent = message || "응답 텍스트를 찾지 못했습니다.";
  } catch (error) {
    // 네트워크 오류처럼 fetch 자체가 실패한 경우입니다.
    console.log(error);
    aiResult.textContent = "통신 중 오류가 발생했습니다.";
  } finally {
    // 실습 3: 성공하든 실패하든 마지막에는 버튼을 다시 활성화합니다.
    recommendBtn.disabled = false;
  }
});

function getResponseText(data) {
  if (typeof data.output_text === "string") {
    return data.output_text;
  }

  if (!Array.isArray(data.output)) {
    return "";
  }

  for (const outputItem of data.output) {
    if (!Array.isArray(outputItem.content)) {
      continue;
    }

    for (const contentItem of outputItem.content) {
      if (typeof contentItem.text === "string") {
        return contentItem.text;
      }
    }
  }

  return "";
}