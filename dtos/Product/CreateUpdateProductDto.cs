using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DotNetCoreInventoryDashboard.dtos.Product
{
    public class CreateUpdateProductDto
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public int PurchaseRate { get; set; }
        public int SaleRate { get; set; } 
        public string ImagePath { get; set; } = "image path";
        public int CategoryId { get; set; }
        public DateTime CreateAt { get; set; }

    }
}