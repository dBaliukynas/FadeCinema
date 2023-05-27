using System.Collections;
using System.Collections.Generic;

namespace FadeCinema.Models.V1.Responses
{
    public class AuthFailureResponse
    {
        public IEnumerable<string> ErrorMessages { get; set;}
    }
}
