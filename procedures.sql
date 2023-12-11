-- procedure to check in any inventory records in the given date range have specific amount plus a value
-- greater than predefined warehouse maxValue
--
--
-- SELECT * FROM check_inventory_records('2023-01-01'::timestamp, '2023-02-01'::timestamp, 500, 10, 400);
-- this call checks for inventory records between January 1, 2023, and February 1, 2023, where the sum
-- of (quantity + additional_value) for each product is equal to 500 and greater than 400.

CREATE OR REPLACE FUNCTION check_inventory_records(
    start_date timestamp, 
    end_date timestamp, 
    target_amount integer,
    additional_value integer,
    max_value integer
)
RETURNS TABLE (
    product_id integer,
    total_quantity integer,
    record_date timestamp
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        product_id,
        SUM(quantity + additional_value) AS total_quantity,
        MAX(record_date) AS record_date
    FROM
        inventory
    WHERE
        record_date BETWEEN start_date AND end_date
    GROUP BY
        product_id
    HAVING
        SUM(quantity + additional_value) = target_amount
        AND SUM(quantity + additional_value) > max_value;
END;
$$ LANGUAGE plpgsql;
