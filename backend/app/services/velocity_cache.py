import time
from collections import defaultdict, deque
from typing import Dict, Tuple, Optional

class SlidingWindowVelocityCache:
    """
    Sliding-Window Entity Velocity Cache.
    Tracks real-time burst velocity (10-minute window) and 1-hour spending sums
    across composite cardholder keys (card1 + addr1) in sub-milliseconds.
    """
    def __init__(self, window_10m_sec: int = 600, window_1h_sec: int = 3600):
        self.window_10m_sec = window_10m_sec
        self.window_1h_sec = window_1h_sec
        # Map: entity_key -> deque of (timestamp, amount)
        self._cache: Dict[str, deque] = defaultdict(deque)
        # Entity spending statistics: key -> list of historical amounts
        self._entity_history: Dict[str, list] = defaultdict(list)

    def _clean_old_entries(self, queue: deque, current_time: float):
        cutoff = current_time - self.window_1h_sec
        while queue and queue[0][0] < cutoff:
            queue.popleft()

    def record_and_get_velocity(
        self,
        card1: Optional[int],
        addr1: Optional[float],
        amount: float,
        timestamp: Optional[float] = None
    ) -> Dict[str, float]:
        """
        Records a transaction and returns real-time sliding-window velocity metrics.
        """
        now = timestamp or time.time()
        card_key = str(card1 or "anon_card")
        composite_key = f"{card_key}_{addr1 or 'anon_addr'}"

        queue = self._cache[composite_key]
        self._clean_old_entries(queue, now)

        # Append current transaction
        queue.append((now, amount))
        self._entity_history[composite_key].append(amount)

        # 10-Minute Velocity Burst Count
        cutoff_10m = now - self.window_10m_sec
        burst_10m_count = sum(1 for ts, _ in queue if ts >= cutoff_10m)

        # 1-Hour Cumulative Spending Sum
        sum_1h = sum(amt for _, amt in queue)

        # Historical spending deviation z-score
        history = self._entity_history[composite_key]
        if len(history) > 1:
            mean_amt = sum(history) / len(history)
            variance = sum((x - mean_amt) ** 2 for x in history) / len(history)
            std_amt = variance ** 0.5 or 1.0
            z_score = (amount - mean_amt) / std_amt
        else:
            mean_amt = amount
            z_score = 0.0

        return {
            "card_addr_10m_burst_count": float(burst_10m_count),
            "card_addr_1h_spending_sum": round(float(sum_1h), 2),
            "card_addr_historical_mean": round(float(mean_amt), 2),
            "spending_z_score": round(float(z_score), 3),
            "is_velocity_anomalous": bool(burst_10m_count >= 3 or z_score >= 3.0)
        }

    def clear(self):
        self._cache.clear()
        self._entity_history.clear()

velocity_cache = SlidingWindowVelocityCache()
