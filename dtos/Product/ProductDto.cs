using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using DotNetCoreInventoryDashboard.dtos.Department;

namespace DotNetCoreInventoryDashboard.dtos.Product
{
    public class ProductDto
    {
        public int ProductId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public int PurchaseRate { get; set; }
        public int SaleRate { get; set; }
        public string ImagePath { get; set; } = string.Empty;
        public int? CategoryId { get; set; }
        public DateTime CreateAt { get; set; }
    }
}