
import type { CalculatorInputs, CalculationOutputs, DRE, AdvancedInsights } from '../types';

export const calculateMetrics = (inputs: CalculatorInputs): CalculationOutputs => {
  const {
    productCost,
    sellPrice,
    mlFeePercentage,
    taxPercentage,
    adsPercentage,
    packagingCost,
    shippingCost,
    otherCost,
    isFull,
    fullCost,
    promotionPercentage,
    proLaborePercentage,
    targetMarginPercentage,
    targetRoiPercentage,
  } = inputs;

  const marketplaceFixedFee = (sellPrice > 0 && sellPrice < 79) ? 6.50 : 0;

  // Valores Unitários
  const taxAmount = sellPrice * taxPercentage;
  const mlFeeAmount = sellPrice * mlFeePercentage;
  const adsAmount = sellPrice * adsPercentage;
  const promotionAmount = sellPrice * promotionPercentage;
  const proLaboreAmount = sellPrice * proLaborePercentage;
  
  // Logística e Fixos
  const totalFixedCosts = packagingCost + otherCost + shippingCost + marketplaceFixedFee + (isFull ? fullCost : 0);

  // Lucro Líquido Real
  const netProfitPerUnit = sellPrice - taxAmount - mlFeeAmount - adsAmount - promotionAmount - proLaboreAmount - totalFixedCosts - productCost;
  const netMarginPercentage = sellPrice > 0 ? netProfitPerUnit / sellPrice : 0;
  
  const totalInvestedPerUnit = productCost + totalFixedCosts;
  const roiPercentage = totalInvestedPerUnit > 0 ? netProfitPerUnit / totalInvestedPerUnit : 0;

  const dre: DRE = {
    grossRevenue: sellPrice,
    taxes: -taxAmount,
    mlFee: -mlFeeAmount,
    ads: -adsAmount,
    promotion: -promotionAmount,
    proLabore: -proLaboreAmount,
    fixedCosts: -totalFixedCosts,
    productCost: -productCost,
    netProfit: netProfitPerUnit,
  };

  // BREAK-EVEN & ADVANCED DATA
  const totalVariablePct = taxPercentage + mlFeePercentage + adsPercentage + promotionPercentage + proLaborePercentage;
  const breakEvenPrice = totalVariablePct < 1 ? (productCost + totalFixedCosts) / (1 - totalVariablePct) : 0;

  // Gerando Advanced Insights
  const advanced: AdvancedInsights = {
    maxCacAllowed: Math.max(0, netProfitPerUnit + adsAmount), // Quanto eu posso gastar de Ads total pra ficar no 0x0
    sensitivityAnalysis: {
        costIncreaseImpact: (productCost * 1.1) + totalFixedCosts > sellPrice * (1 - totalVariablePct) ? -1 : 0, // 0 = aguenta, -1 = quebra
        priceDropImpact: (sellPrice * 0.95) - (taxAmount * 0.95) - mlFeeAmount - totalFixedCosts - productCost < 0 ? -1 : 0
    },
    cashFlowVelocityScore: Math.min(100, Math.round(roiPercentage * 200)), // Estimativa baseada em rentabilidade
    breakEvenUnits: productCost > 0 ? Math.ceil((totalFixedCosts * 10) / netProfitPerUnit) : 0 // Quantas vendas pra pagar os custos fixos de um lote
  };

  return {
    netProfitPerUnit,
    netMarginPercentage,
    roiPercentage,
    projectedProfit100: netProfitPerUnit * 100,
    projectedProfit1000: netProfitPerUnit * 1000,
    breakEvenPrice,
    maxPurchasePriceForMargin: Math.max(0, sellPrice * (1 - totalVariablePct - targetMarginPercentage) - totalFixedCosts),
    maxPurchasePriceForRoi: Math.max(0, (sellPrice * (1 - totalVariablePct) / (1 + targetRoiPercentage)) - totalFixedCosts),
    healthStatus: netMarginPercentage > 0.15 ? 'Saudável' : netMarginPercentage > 0 ? 'Ajustável' : 'Prejuízo',
    dre,
    netProfitOwnChannel: sellPrice - taxAmount - adsAmount - proLaboreAmount - (packagingCost + otherCost) - productCost,
    advanced
  };
};
