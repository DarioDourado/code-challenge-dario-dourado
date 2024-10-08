/* List out the computational inefficiencies and anti-patterns found in the code block below.

1. This code block uses
    1. ReactJS with TypeScript.
    2. Functional components.
    3. React Hooks
2. You should also provide a refactored version of the code, but more points are awarded to accurately stating the issues and explaining correctly how to improve them.
*/

interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: Blockchain; // add Blockchain
}
interface FormattedWalletBalance {
  currency: string;
  amount: number;
  formatted: string;
  blockchain: Blockchain; // add Blockchain
}

type Blockchain = "Osmosis" | "Ethereum" | "Arbitrum" | "Zilliqa" | "Neo"; // Type the Blockchain

interface Props extends BoxProps {}
const WalletPage: React.FC<Props> = (props: Props) => {
  const { children, ...rest } = props;
  const balances = useWalletBalances();
  const prices = usePrices();

  const getPriority = (blockchain: Blockchain): number => {
    switch (blockchain) {
      case "Osmosis":
        return 100;
      case "Ethereum":
        return 50;
      case "Arbitrum":
        return 30;
      case "Zilliqa":
        return 20;
      case "Neo":
        return 20;
      default:
        return -99;
    }
  };

  const sortedBalances = useMemo(() => {
    return balances
      .filter((balance: WalletBalance) => {
        // const balancePriority = getPriority(balance.blockchain); // Variable declared but not used anywhere

        // I will declare lhsPriority variable
        const lhsPriority = getPriority(balance.blockchain); // Could use a more specific variable name

        // Inverted Logical, Fix   return lhsPriority > -99 && balance.amount > 0;
        if (lhsPriority > -99) {
          // lhsPriority no defined on 1st stage
          if (balance.amount <= 0) {
            return true;
          }
        }
        return false;
      })
      .sort((lhs: WalletBalance, rhs: WalletBalance) => {
        const leftPriority = getPriority(lhs.blockchain);
        const rightPriority = getPriority(rhs.blockchain);

        // Could be reviewed regarding the business rule, but for me make more sense  return rightPriority - leftPriority to sort
        return rightPriority - leftPriority;
        if (leftPriority > rightPriority) {
          return -1;
        } else if (rightPriority > leftPriority) {
          return 1;
        }
      });
  }, [balances, prices]);

  const formattedBalances = sortedBalances.map((balance: WalletBalance) => {
    return {
      ...balance,
      formatted: balance.amount.toFixed(), // Could use toFixed(4)
    };
  });

  // You should use formattedBalances instead of sortedBalances when mapping for rows. It will work either way, but the goal of assigning sortedBalances.map to a constant (formattedBalances) is to maintain clean code and separate concerns.

  const rows = formattedBalances.map(
    (balance: FormattedWalletBalance, index: number) => {
      const usdValue = prices[balance.currency] * balance.amount;
      return (
        <WalletRow
          className={classes.row}
          key={index}
          amount={balance.amount}
          usdValue={usdValue}
          formattedAmount={balance.formatted}
        />
      );
    }
  );

  return <div {...rest}>{rows}</div>;
};

// This fn could be removed.
// function useMemo(arg0: () => any, arg1: any[]) {
//   throw new Error("Function not implemented.");
// }
