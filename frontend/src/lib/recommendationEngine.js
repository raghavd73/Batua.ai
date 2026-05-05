function getRiskScore(userRisk, stockRisk) {
  if (userRisk === stockRisk) return 5;

  if (
    (userRisk === "Low" && stockRisk === "Medium") ||
    (userRisk === "Medium" && stockRisk === "Low") ||
    (userRisk === "Medium" && stockRisk === "High") ||
    (userRisk === "High" && stockRisk === "Medium")
  ) {
    return 2;
  }

  return 0;
}

function getSectorScore(userSector, stockSector) {
  if (userSector === "Any") return 1;
  if (userSector === stockSector) return 3;
  return 0;
}

function getCapScore(userCap, stockCap) {
  if (userCap === "Any") return 1;
  if (userCap === stockCap) return 2;
  return 0;
}

function scoreStock(stock, userAnswers) {
  let score = 0;

  score += getRiskScore(userAnswers.risk, stock.risk);

  if (stock.horizon.includes(userAnswers.horizon)) {
    score += 4;
  }

  if (stock.goals.includes(userAnswers.goal)) {
    score += 4;
  }

  score += getSectorScore(userAnswers.sector, stock.sector);
  score += getCapScore(userAnswers.cap, stock.cap);

  return score;
}

function buildReasonText(stock, userAnswers) {
  const reasons = [];

  if (stock.risk === userAnswers.risk) {
    reasons.push(`matches your ${userAnswers.risk.toLowerCase()} risk preference`);
  }

  if (stock.horizon.includes(userAnswers.horizon)) {
    reasons.push(`fits your ${userAnswers.horizon.toLowerCase()} investment horizon`);
  }

  if (stock.goals.includes(userAnswers.goal)) {
    reasons.push(`supports your goal of ${userAnswers.goal.toLowerCase()}`);
  }

  if (userAnswers.sector !== "Any" && stock.sector === userAnswers.sector) {
    reasons.push(`belongs to your preferred ${userAnswers.sector} sector`);
  }

  if (userAnswers.cap !== "Any" && stock.cap === userAnswers.cap) {
    reasons.push(`matches your ${userAnswers.cap.toLowerCase()} preference`);
  }

  if (reasons.length === 0) {
    return "This stock is one of the closest available matches for your current profile.";
  }

  return `Recommended because it ${reasons.join(", ")}.`;
}

function getBadge(stock, rank, userAnswers) {
  if (rank === 0) return "Best Match";
  if (stock.risk === "Low" && userAnswers.risk === "Low") return "Low Risk";
  if (stock.goals.includes("Growth") && userAnswers.goal === "Growth") return "Growth Pick";
  if (
    stock.goals.includes("Dividend income") &&
    userAnswers.goal === "Dividend income"
  ) {
    return "Dividend Pick";
  }
  return "Recommended";
}

export function getRecommendations(stocks, userAnswers, limit = 3) {
  return stocks
    .map((stock) => {
      const recommendationScore = scoreStock(stock, userAnswers);
      return {
        ...stock,
        recommendationScore,
        reason: buildReasonText(stock, userAnswers),
      };
    })
    .sort((a, b) => b.recommendationScore - a.recommendationScore)
    .slice(0, limit)
    .map((stock, index) => ({
      ...stock,
      badge: getBadge(stock, index, userAnswers),
    }));
}