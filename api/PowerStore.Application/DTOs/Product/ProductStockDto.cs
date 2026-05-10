using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PowerStore.Application.DTOs.Product;

public class ProductStockDto
{
    public Guid ProductId { get; set; }
    public int StockQuantity { get; set; }
    public bool IsAvailable => StockQuantity > 0;
}